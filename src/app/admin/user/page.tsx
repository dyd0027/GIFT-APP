import UserAppendForm from '@/components/admin/user/UserAppendForm';
import UserInsertForm from '@/components/admin/user/UserInsertForm';
import UserAllUploadForm from '@/components/admin/user/UserAllUploadForm';

const UserPage = () => {
  return (
    <div className="flex flex-col gap-[10px] px-[10px]">
      <UserAllUploadForm />
      <UserAppendForm />
      <UserInsertForm />
    </div>
  );
};
export default UserPage;
