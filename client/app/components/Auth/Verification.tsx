import { useActivationMutation } from "../../../redux/features/auth/authApi";
import {styles} from "@/app/styles/style";
import { FC, useRef, useState } from "react";
import toast from "react-hot-toast";
import { VscWorkspaceTrusted } from "react-icons/vsc";
import { useSelector } from "react-redux";

type Props = {
  setRoute?: (route: string) => void;
};
type verifyNumber = {
  "0": string;
  "1": string;
  "2": string;
  "3": string;
  "4": string;
  "5": string;
};

const Verification: FC<Props> = ({ setRoute }) => {
  const [invalidError, setInvalidError] = useState<boolean>(false);
  const { token } = useSelector((state: { auth: { token: string } }) => state.auth);
  const [activation] = useActivationMutation();
  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];
  const [verifyNumber, setVerifyNumber] = useState<verifyNumber>({
    0: "",
    1: "",
    2: "",
    3: "",
    4: "",
    5: "",
  });
  // Handle OTP verification
  const verificationHandler = async () => {
    const verificationNumber = Object.values(verifyNumber).join("");
    if (verificationNumber.length !== 6) {
      setInvalidError(true);
      return;
    }
    try {
      setInvalidError(false);
      await activation({
        activation_token: token,
        activation_code: verificationNumber,
      }).unwrap();
      toast.success("Account Activated Successfully!");
      setRoute?.("Login");
    } catch (error) {
      const errorData = error as { data?: { message?: string } };
      toast.error(errorData.data?.message || "Invalid OTP");
      setInvalidError(true);
    }
  };
  // Handle input change Focus Next box
  const handleInputChange = (index: number, value: string) => {
    setInvalidError(false);
    const nextValue = value.slice(-1);
    const newVerifyNumber = { ...verifyNumber, [index]: nextValue };
    setVerifyNumber(newVerifyNumber);
    if (nextValue === "" && index > 0) {
      inputRefs[index - 1].current?.focus();
    } else if (nextValue.length === 1 && index < inputRefs.length - 1) {
      inputRefs[index + 1].current?.focus();
    }
  };

  return (
    <div className="px-4 sm:px-0">
      <h1 className={`${styles.title} text-[20px] sm:text-[25px]`}>Verify Your Account</h1>
      <div className="mt-4 sm:mt-6">
        {/* Blue circular icon */}
        <div className="w-full flex items-center justify-center">
          <div className="w-[60px] h-[60px] sm:w-[80px] sm:h-[80px] rounded-full bg-[#497DF2] flex items-center justify-center">
            <VscWorkspaceTrusted size={24} className="sm:size-[30px]" />
          </div>
        </div>
      </div>
      <div className="mt-6 sm:mt-8">
        {/* Six OTP inputs */}
        <div className="m-auto flex items-center justify-center gap-2 sm:gap-4">
          {Object.keys(verifyNumber).map((key, index) => (
            <input
              type="number"
              key={key}
              ref={inputRefs[index]}
              className={`w-[45px] h-[45px] sm:w-[65px] sm:h-[65px] bg-transparent border-[2px] sm:border-[3px] rounded-[8px] sm:rounded-[10px] flex items-center text-black dark:text-white justify-center text-[14px] sm:text-[18px] font-Poppins outline-none text-center ${
                invalidError
                  ? "shake border-red-500"
                  : "dark:border-white border-[#0000004a]"
              }`}
              placeholder=""
              maxLength={1}
              value={verifyNumber[key as keyof verifyNumber]}
              onChange={(e) => handleInputChange(index, e.target.value)}
            />
          ))}
        </div>
      </div>
      <div className="mt-6 sm:mt-8">
        {/* Verify button */}
        <div className="w-full flex justify-center">
          <button className={`${styles.button}`} onClick={verificationHandler}>
            Verify OTP
          </button>
        </div>
      </div>
      <div className="mt-4 sm:mt-6">
        {/* Go back footer link */}
        <h5 className="text-center font-Poppins text-[12px] sm:text-[14px] text-black dark:text-white">
          Go Back to sign in?
          <span
            className="text-[#2190ff] pl-1 cursor-pointer"
            onClick={() => setRoute?.("Login")}
          >
            SignIn
          </span>
        </h5>
      </div>
    </div>
  );
};

export default Verification;
