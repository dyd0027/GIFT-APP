import UserAppendForm from '@/components/admin/user/UserAppendForm';
import UserInsertForm from '@/components/admin/user/UserInsertForm';
import UserAllUploadForm from '@/components/admin/user/UserAllUploadForm';
import UserDeleteForm from '@/components/admin/user/UserDeleteForm';

const UserPage = () => {
  return (
    <div className="mt-[10px] flex flex-1 flex-col gap-[10px] px-[10px]">
      <UserAllUploadForm />
      <UserAppendForm />
      <UserInsertForm />
      <UserDeleteForm />
    </div>
  );
};
export default UserPage;
