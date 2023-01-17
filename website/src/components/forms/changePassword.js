import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { changePassword } from "../../DAL/api";
import { addChangePasswordExpiration } from "../../features/user/userSlice";
import Formcomp from "./formComp";

export default function ChangePassword(){
    const userData = useSelector((state)=>state.user);
    const dispatch = useDispatch();

    const navigate = useNavigate()

    useEffect(() => {
        async function validate() {
            const expireDate=new Date(JSON.parse(userData.expiredPasswordChange))
            if(expireDate){
                if(expireDate>new Date()){
                    return
                }
            }
            navigate('/')
        }
        validate()
    }, [])

    async function change(allset){
        const password = allset.password.value
        if(password === allset.repeatPassword.value){
            const response = await changePassword(userData.user.email||userData.user.username, password)
            if(response.ok){
                dispatch(addChangePasswordExpiration(JSON.stringify(new Date())))
                navigate('/')
                return
            }
            alert('something went wrong')
            navigate('/')
            return
        }
        alert('password must be the same on both')
    }

    return (
        <div>
            <span>you recived an email with a secret code plese enter the code here:</span>
            <Formcomp formTitle='Change Password' onclick={change} 
            data={{password: {
                id: 0,
                serverName: 'password',
                placeholder: "Enter password",
                label: "Code", iconName: "key-fill",
                validations: { require: true, minLen: 5 },
                eror: "",
                type: "current-password",
                class: "col-6",
                value: "",        
                ViewType: "password",
            },
            repeatPassword: {
                id: 1,
                serverName: 'password',
                placeholder: "Enter password again",
                label: "Repeat Password", iconName: "key",
                validations: { require: true, minLen: 5 },
                eror: "",
                type: "current-password",
                class: "col-6",
                value: "",        
                ViewType: "password",
            }}} submitName='Change Password'></Formcomp>
        </div>
    )
}