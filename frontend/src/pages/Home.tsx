import { AppComponentProps, RoleName } from "../types";
import Buyer from "./Buyer";
import Seller from "./Seller";

export default function Home({ state, dispatch }: AppComponentProps) {
    return (
        <>
        {
            state?.user?.roleName === RoleName.BUYER ? (
                <Buyer state={state} dispatch={dispatch} />
            ) : (
                <Seller state={state} dispatch={dispatch}/>
            )
        }
        </>

    )
}