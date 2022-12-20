import { useAppSelector } from "../store/hooks";
import { selectUser } from "../store/userSlice";
import { RoleName } from "../types";
import Buyer from "./Buyer";
import Seller from "./Seller";

export default function Home() {
    const user = useAppSelector(selectUser);
    return (
        <>
        {
            user?.roleName === RoleName.BUYER ? (
                <Buyer />
            ) : (
                <Seller />
            )
        }
        </>

    )
}