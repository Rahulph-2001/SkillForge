-- Sync review counts and ratings for users from actual reviews
UPDATE users u
SET 
  review_count = COALESCE(subq.cnt, 0),
  rating = COALESCE(subq.avg_rating, 0)
FROM (
  SELECT 
    provider_id,
    COUNT(*) as cnt,
    AVG(rating) as avg_rating
  FROM reviews
  GROUP BY provider_id
) subq
WHERE u.id = subq.provider_id;

-- Sync skill ratings from reviews
UPDATE skills s
SET rating = COALESCE(subq.avg_rating, 0)
FROM (
  SELECT 
    skill_id,
    AVG(rating) as avg_rating
  FROM reviews
  GROUP BY skill_id
) subq
WHERE s.id = subq.skill_id;

-- Sync total sessions completed for users from completed bookings
UPDATE users u
SET total_sessions_completed = COALESCE(subq.cnt, 0)
FROM (
  SELECT 
    user_id,
    COUNT(*) as cnt
  FROM (
    SELECT provider_id as user_id FROM bookings WHERE status = 'completed'
    UNION ALL
    SELECT learner_id as user_id FROM bookings WHERE status = 'completed'
  ) combined
  GROUP BY user_id
) subq
WHERE u.id = subq.user_id;

-- Sync total sessions for skills from completed bookings
UPDATE skills s
SET total_sessions = COALESCE(subq.cnt, 0)
FROM (
  SELECT 
    skill_id,
    COUNT(*) as cnt
  FROM bookings 
  WHERE status = 'completed'
  GROUP BY skill_id
) subq
WHERE s.id = subq.skill_id;
