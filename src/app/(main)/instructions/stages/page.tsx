import { getStages } from '@/server/actions/instructionsActions';
import StageInstructions from '../_components/StageInstructions';

export default async function StagessPage() {
  return <StageInstructions stages$={getStages()} />;
}
