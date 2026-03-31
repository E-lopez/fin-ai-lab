import { SurveyProvider } from '@/stores/survey/SurveyStore';
import Score from '../../src/routes/score/Score';

const mockSurvey = {
  scoreResult: {
    riskLevel: 8.5,
    userName: 'Esteban'
  }
};

export default function ScoreTestWrapper() {
  return (
    <SurveyProvider initialValue={mockSurvey}>
      <Score />
    </SurveyProvider>
  );
}