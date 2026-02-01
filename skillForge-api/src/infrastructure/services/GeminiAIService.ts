import { injectable } from 'inversify';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { IGeminiAIService, ApplicantProfile, ProjectDetails } from '../../domain/services/IGeminiAIService';
import { MatchAnalysis } from '../../domain/entities/ProjectApplication';
import { env } from '../../config/env';

@injectable()
export class GeminiAIService implements IGeminiAIService {
  private readonly genAI: GoogleGenerativeAI;
  private readonly model: any;

  constructor() {
    this.genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  }

  async analyzeApplicantMatch(
    project: ProjectDetails,
    applicant: ApplicantProfile,
    coverLetter: string
  ): Promise<MatchAnalysis> {
    const prompt = this.buildAnalysisPrompt(project, applicant, coverLetter);

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Parse JSON from response
      const jsonMatch = text.match(/```json\n?([\s\S]*?)\n?```/);
      const jsonString = jsonMatch ? jsonMatch[1] : text;
      const analysis = JSON.parse(jsonString) as MatchAnalysis;

      // Validate and clamp scores
      return this.validateAnalysis(analysis);
    } catch (error) {
      console.error('Gemini AI analysis failed:', error);
      // Return fallback analysis
      return this.getFallbackAnalysis(applicant);
    }
  }

  private buildAnalysisPrompt(
    project: ProjectDetails,
    applicant: ApplicantProfile,
    coverLetter: string
  ): string {
    return `You are an expert talent matcher for a skill-sharing platform. Analyze how well this applicant matches the project requirements.

## Project Details
- **Title**: ${project.title}
- **Description**: ${project.description}
- **Category**: ${project.category}
- **Required Skills/Tags**: ${project.tags.join(', ')}
- **Budget**: ${project.budget} credits
- **Duration**: ${project.duration}

## Applicant Profile
- **Name**: ${applicant.name}
- **Bio**: ${applicant.bio || 'Not provided'}
- **Overall Rating**: ${applicant.rating}/5 (${applicant.reviewCount} reviews)
- **Total Sessions Completed**: ${applicant.totalSessionsCompleted}
- **Skills Offered**:
${applicant.skillDetails.map(s => `  - ${s.title} (${s.category}, ${s.level}) - Rating: ${s.rating}/5, ${s.totalSessions} sessions`).join('\n')}

## Cover Letter
${coverLetter}

## Analysis Task
Provide a comprehensive match analysis in the following JSON format. Be objective and fair in your assessment. Consider skills relevance, experience level, ratings, and cover letter quality.

\`\`\`json
{
  "overallScore": <number 0-100>,
  "skillsMatch": {
    "score": <number 0-100>,
    "matchedSkills": ["skill1", "skill2"],
    "missingSkills": ["skill1"],
    "analysis": "<1-2 sentence analysis>"
  },
  "experienceMatch": {
    "score": <number 0-100>,
    "relevantExperience": "<brief summary>",
    "analysis": "<1-2 sentence analysis>"
  },
  "ratingMatch": {
    "score": <number 0-100>,
    "providerRating": ${applicant.rating},
    "reviewCount": ${applicant.reviewCount},
    "analysis": "<1-2 sentence analysis>"
  },
  "coverLetterAnalysis": {
    "score": <number 0-100>,
    "strengths": ["strength1", "strength2"],
    "concerns": ["concern1"],
    "analysis": "<1-2 sentence analysis>"
  },
  "recommendation": "<2-3 sentence recommendation for the project owner>",
  "confidence": <number 0-100 indicating confidence in this analysis>
}
\`\`\`

Important scoring guidelines:
- 80-100: Excellent match, highly recommended
- 60-79: Good match, worth considering
- 40-59: Partial match, some gaps
- 20-39: Weak match, significant gaps
- 0-19: Poor match, not recommended

Respond ONLY with the JSON, no additional text.`;
  }

  private validateAnalysis(analysis: MatchAnalysis): MatchAnalysis {
    const clamp = (value: number, min: number, max: number) => 
      Math.min(max, Math.max(min, value));

    return {
      overallScore: clamp(analysis.overallScore || 50, 0, 100),
      skillsMatch: {
        score: clamp(analysis.skillsMatch?.score || 50, 0, 100),
        matchedSkills: analysis.skillsMatch?.matchedSkills || [],
        missingSkills: analysis.skillsMatch?.missingSkills || [],
        analysis: analysis.skillsMatch?.analysis || 'Analysis not available',
      },
      experienceMatch: {
        score: clamp(analysis.experienceMatch?.score || 50, 0, 100),
        relevantExperience: analysis.experienceMatch?.relevantExperience || 'Not available',
        analysis: analysis.experienceMatch?.analysis || 'Analysis not available',
      },
      ratingMatch: {
        score: clamp(analysis.ratingMatch?.score || 50, 0, 100),
        providerRating: analysis.ratingMatch?.providerRating || 0,
        reviewCount: analysis.ratingMatch?.reviewCount || 0,
        analysis: analysis.ratingMatch?.analysis || 'Analysis not available',
      },
      coverLetterAnalysis: {
        score: clamp(analysis.coverLetterAnalysis?.score || 50, 0, 100),
        strengths: analysis.coverLetterAnalysis?.strengths || [],
        concerns: analysis.coverLetterAnalysis?.concerns || [],
        analysis: analysis.coverLetterAnalysis?.analysis || 'Analysis not available',
      },
      recommendation: analysis.recommendation || 'No recommendation available',
      confidence: clamp(analysis.confidence || 70, 0, 100),
    };
  }

  private getFallbackAnalysis(applicant: ApplicantProfile): MatchAnalysis {
    // Simple heuristic-based fallback
    const ratingScore = (applicant.rating / 5) * 100;
    const experienceScore = Math.min(applicant.totalSessionsCompleted * 5, 100);
    const overallScore = (ratingScore * 0.4 + experienceScore * 0.3 + 50 * 0.3);

    return {
      overallScore: Math.round(overallScore),
      skillsMatch: {
        score: 50,
        matchedSkills: applicant.skills.slice(0, 3),
        missingSkills: [],
        analysis: 'Automated analysis - manual review recommended',
      },
      experienceMatch: {
        score: Math.round(experienceScore),
        relevantExperience: `${applicant.totalSessionsCompleted} sessions completed`,
        analysis: 'Experience score based on completed sessions',
      },
      ratingMatch: {
        score: Math.round(ratingScore),
        providerRating: applicant.rating,
        reviewCount: applicant.reviewCount,
        analysis: `Rating: ${applicant.rating}/5 from ${applicant.reviewCount} reviews`,
      },
      coverLetterAnalysis: {
        score: 50,
        strengths: ['Application submitted'],
        concerns: ['AI analysis unavailable'],
        analysis: 'Manual review of cover letter recommended',
      },
      recommendation: 'AI analysis was unavailable. Please review this application manually based on the applicant\'s profile and cover letter.',
      confidence: 30,
    };
  }
}