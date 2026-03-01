import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { skillService, type CreateSkillPayload, type SkillResponse } from '../../services/skillService';
import { type ApiErrorPayload, getErrorMessage } from '../../utils/errorUtils';


interface SkillState {
    mySkills: SkillResponse[];
    loading: boolean;
    error: string | null;
}

const initialState: SkillState = {
    mySkills: [],
    loading: false,
    error: null,
}

export const fetchMySkills = createAsyncThunk<
    SkillResponse[],
    { page?: number; limit?: number; status?: string },
    { rejectValue: string }
>(
    'skills/fetchMySkills',
    async (params = {}, { rejectWithValue }) => {
        try {
            const response = await skillService.getMySkills(params);
            return response.data.skills; // Extract skills array from paginated response
        } catch (error: unknown) {
            return rejectWithValue(getErrorMessage(error, 'Failed to fetch skills'));
        }
    }
)

export const createSkill = createAsyncThunk<
    SkillResponse,
    { data: CreateSkillPayload; file?: Blob },
    { rejectValue: string }
>(
    'skills/createSkill',
    async ({ data, file }, { rejectWithValue }) => {
        try {
            const response = await skillService.createSkill(data, file);
            return response.data;
        } catch (error: unknown) {
            const axiosLike = error as { response?: { data?: ApiErrorPayload } };
            return rejectWithValue(
                axiosLike.response?.data?.message ?? getErrorMessage(error, 'Failed to create skill')
            );
        }
    }
);

export const updateSkill = createAsyncThunk<
    SkillResponse,
    { id: string; data: Partial<CreateSkillPayload>; imageFile?: File },
    { rejectValue: string }
>(
    'skills/updateSkill',
    async ({ id, data, imageFile }, { rejectWithValue }) => {
        try {
            const response = await skillService.updateSkill(id, data, imageFile);
            return response.data;
        } catch (error: unknown) {
            const axiosLike = error as { response?: { data?: ApiErrorPayload } };
            return rejectWithValue(
                axiosLike.response?.data?.message ?? getErrorMessage(error, 'Failed to update skill')
            );
        }
    }
);

export const toggleSkillBlock = createAsyncThunk<
    SkillResponse,
    string,
    { rejectValue: string }
>(
    'skills/toggleSkillBlock',
    async (id, { rejectWithValue }) => {
        try {
            const response = await skillService.toggleBlock(id);
            return response.data;
        } catch (error: unknown) {
            const axiosLike = error as { response?: { data?: ApiErrorPayload } };
            return rejectWithValue(
                axiosLike.response?.data?.message ?? getErrorMessage(error, 'Failed to toggle skill block status')
            );
        }
    }
);

const skillSlice = createSlice({
    name: 'skills',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch My Skills
            .addCase(fetchMySkills.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMySkills.fulfilled, (state, action) => {
                state.loading = false;
                state.mySkills = action.payload;
            })
            .addCase(fetchMySkills.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? 'Failed to fetch skills';
            })
            // Create Skill
            .addCase(createSkill.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createSkill.fulfilled, (state, action) => {
                state.loading = false;
                state.mySkills.push(action.payload);
            })
            .addCase(createSkill.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? 'Failed to create skill';
            })
            // Update Skill
            .addCase(updateSkill.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateSkill.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.mySkills.findIndex(s => s.id === action.payload.id);
                if (index !== -1) {
                    state.mySkills[index] = action.payload;
                }
            })
            .addCase(updateSkill.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? 'Failed to update skill';
            })
            // Toggle Block
            .addCase(toggleSkillBlock.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(toggleSkillBlock.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.mySkills.findIndex(s => s.id === action.payload.id);
                if (index !== -1) {
                    state.mySkills[index] = action.payload;
                }
            })
            .addCase(toggleSkillBlock.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? 'Failed to toggle skill block status';
            });
    }
});

export const { clearError } = skillSlice.actions;
export default skillSlice.reducer;