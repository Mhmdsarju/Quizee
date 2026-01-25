import ContestForm from "./ContestForm";

export default function EditContestModal({ contest, onClose, onSuccess }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <ContestForm
        initialData={contest}
        onClose={onClose}
        onSuccess={onSuccess}
      />
    </div>
  );
}
