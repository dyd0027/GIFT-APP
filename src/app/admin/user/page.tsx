import UserAppendForm from '@/components/UserAppendForm';
import UserUploadForm from '@/components/UserUploadForm';

const UserPage = () => {
  return (
    <div className="flex flex-col gap-[10px]">
      <UserUploadForm />
      <UserAppendForm />
    </div>
  );
};
export default UserPage;
