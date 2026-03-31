import DataErrors from "@/constants/DataErrors";
import { CreateUserRequest, ScoringData } from "@/models/dto/CreateUserRequest";
import { ScoreResponse } from "@/models/dto/ScoreResponse";
import { UpdateUserRiskRequest } from "@/models/dto/UpdateUserRiskRequest";
import { User, UserApiResponse } from "@/models/dto/user";
import { UserService } from "@/services/userApi/userService";

import { useAlertDispatch } from "@/stores/alerts/AlertsStore";
import { useSurveyDispatch } from "@/stores/survey/SurveyStore";

export function useComposerHandler() {
    const alertDispatch = useAlertDispatch();
    const surveyDispatch = useSurveyDispatch();

    const createUser = async (payload: CreateUserRequest) => {
      try {
        
        const { userData, scoringData, access_token } = payload;
        
        // Step 1: Create user with default risk level
        const userWithDefaults: User = {
          ...userData,
          riskLevel: userData.riskLevel || "1"
        };
        const { body: userResponse }: UserApiResponse = await UserService.createUser(userWithDefaults, access_token);

        
        // Step 2: Prepare scoring data with user ID for score service
        const scoreServicePayload = {
          demographics: {
            ...scoringData.demographics,
            idNumber: userResponse.id || userResponse.idNumber,
          },
          sections: scoringData.sections
        };
        

        // Step 3: Register survey/scoring
        const scoreResponse: ScoreResponse = await registerSurvey(scoreServicePayload, access_token);

        
        // Step 4: Update user risk level
        const riskUpdateRequest: UpdateUserRiskRequest = {
          userId: userResponse.id || userResponse.idNumber,
          riskLevel: scoreResponse.riskLevel.toString(),
          riskDistance: scoreResponse.risk_distance_analysis.risk_distance,
          riskScore: scoreResponse.risk_distance_analysis.risk_score,
          riskCategory: scoreResponse.risk_distance_analysis.risk_category,
          closestCluster: scoreResponse.risk_distance_analysis.closest_cluster
        };
        
        const updateResponse = await UserService.updateUserRisk(riskUpdateRequest, access_token);

        
        // Update survey store with results
        surveyDispatch({
          type: 'SAVE_SCORING',
          scoreResult: scoreResponse, 
        });
        
        return { success: true, data: updateResponse };
        
      } catch (error: any) {
        console.error("User creation failed:", error);
        alertDispatch({
          type: "SET_ALERT",
          name: error.message || "Creation failed",
          message: error.message ? DataErrors.get(error.message) : "An error occurred during user creation"
        });
        return { success: false, error: error.message };
      }
    };

    // Helper function to register survey - calls the score lambda endpoint
    const registerSurvey = async (scoringData: ScoringData, access_token: string): Promise<ScoreResponse> => {
      try {
        const scoreUrl = import.meta.env.VITE_SCORE_LAMBDA_URL;

        if (!scoreUrl) {
          throw new Error('VITE_SCORE_LAMBDA_URL not configured');
        }

        const response = await fetch(`${scoreUrl}clustered-score?token=${encodeURIComponent(access_token ?? '')}`, {
          method: 'POST',
          mode: 'cors',
          body: JSON.stringify(scoringData)
        });

        if (!response.ok) {
          throw new Error(`Score service error: ${response.status} ${response.statusText}`);
        }

        const result = await response.json();

        
        return result as ScoreResponse;
      } catch (error: any) {
        console.error('Score service error:', error);
        throw new Error(`Failed to register survey: ${error.message}`);
      }
    };

    return {
      createUser,
    }
}