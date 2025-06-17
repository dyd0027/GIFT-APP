import UserAppendForm from '@/components/admin/user/UserAppendForm';
import UserUploadForm from '@/components/admin/user/UserUploadForm';

const UserPage = () => {
  return (
    <div className="flex flex-col gap-[10px]">
      <UserUploadForm />
      <UserAppendForm />
    </div>
  );
};
export default UserPage;
