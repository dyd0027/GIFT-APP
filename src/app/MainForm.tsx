'use client';
import { useUserStore } from "@/store/userStore";

const MainForm = () => {
    const user = useUserStore((state) => state.user);
    console.log(user);
    return <div>asd</div>
}

export default MainForm;