import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import { skillService, CreateSkillPayload, SkillResponse } from '../../services/skillService';


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

export const fetchMySkills = createAsyncThunk(
    'skills/fetchMySkills',
    async(_, {rejectWithValue})=> {
        try {
            const response = await skillService.getMySkills();
            return response.data;
        }catch(error: any) {
            return rejectWithValue(error.message || 'Failed to fetch skills')
        }
    }
)

export const createSkill = createAsyncThunk(
    'skills/createSkill',
    async({ data, file }: { data: CreateSkillPayload; file?: Blob }, { rejectWithValue }) => {
        try {
            const response = await skillService.createSkill(data, file);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || error.message || 'Failed to create skill');
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
                state.error = action.payload as string;
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
                state.error = action.payload as string;
            });
    }
});

export const { clearError } = skillSlice.actions;
export default skillSlice.reducer;