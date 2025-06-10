import Link from 'next/link';

const AdminPage = () => {
  return (
    <div>
      <Link href="/admin/user" className="block px-4 py-2 hover:bg-indigo-100">
        유저 등록 및 관리
      </Link>
      <Link href="/admin/gift" className="block px-4 py-2 hover:bg-indigo-100">
        선물 관리
      </Link>
    </div>
  );
};

export default AdminPage;
