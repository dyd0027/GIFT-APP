import UserAppendForm from '@/components/admin/user/UserAppendForm';
import UserInsertForm from '@/components/admin/user/UserInsertForm';
import UserUploadForm from '@/components/admin/user/UserUploadForm';

const UserPage = () => {
  return (
    <div className="flex flex-col gap-[10px] px-[10px]">
      <UserUploadForm />
      <UserAppendForm />
      <UserInsertForm />
    </div>
  );
};
export default UserPage;
