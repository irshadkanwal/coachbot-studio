import { Assistant } from '@/lib/models/assistant.models';
import { isAssistantCreationAllowed } from '@/lib/utils/common.utils';
import { getAssistants, getTemplates } from '@/server/actions/assistantActions';
import { getUser } from '@/server/actions/userActions';
import { getAssistantData } from '@/server/db/assistantClient';
import NewAssistantForm from '@/shared/assistant/AssistantForm';
import RedirectBack from '@/shared/FunctionalButtons';
import { Modal } from '@/shared/Modal';

export default async function CreateAgentPage({ searchParams }: { searchParams: Promise<{ id?: string }> }) {
  const [{ id }, user, assistants] = await Promise.all([searchParams, getUser(), getAssistants()]);
  const targetAssistant = id ? await getAssistantData(id) : null;

  if (!id && !isAssistantCreationAllowed(user, assistants)) {
    return <RedirectBack />;
  }

  return (
    <Modal
      titleIcon={id ? 'cbi-edit-2 ms-2' : 'cbi-add-square ms-2'}
      titleKey={id ? 'Assistants.modal.editTitle' : 'Assistants.modal.submitButton'}
      variant="gray"
      isOpen={true}
      showButtons={false}
      className="gap-y-4"
    >
      <NewAssistantForm templates$={getTemplates()} assistant={targetAssistant as Assistant} />
    </Modal>
  );
}
