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
            console.log(' [skillSlice] Fetching my skills...');
            const response = await skillService.getMySkills();
            console.log(' [skillSlice] Skills fetched:', response.data.length, 'skills');
            return response.data;
        }catch(error: any) {
            console.error(' [skillSlice] Failed to fetch skills:', error);
            return rejectWithValue(error.message || 'Failed to fetch skills')
        }
    }
)

export const createSkill = createAsyncThunk(
    'skills/createSkill',
    async({ data, file }: { data: CreateSkillPayload; file?: Blob }, { rejectWithValue }) => {
        try {
            console.log(' [skillSlice] Creating skill with data:', data);
            console.log(' [skillSlice] File present:', !!file);
            const response = await skillService.createSkill(data, file);
            console.log(' [skillSlice] Skill created successfully:', response.data);
            return response.data;
        } catch (error: any) {
            console.error(' [skillSlice] Failed to create skill:', error);
            console.error(' [skillSlice] Error response:', error.response?.data);
            console.error(' [skillSlice] Error status:', error.response?.status);
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