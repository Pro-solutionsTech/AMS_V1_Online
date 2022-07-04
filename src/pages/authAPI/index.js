import { useSelector } from "react-redux";

export const AuthApiToken = () => {
    const authUser = useSelector((state) => state.user)
    return authUser?.access_token
}

export const AuthApiUrl = () => {
    const authSettingDatas = useSelector((state) => state.userCredential.state)
    return authSettingDatas?.apiUrl
}