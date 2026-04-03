"use client";
import React, { FC, useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  AiOutlineEyeInvisible,
  AiOutlineEye,
  AiFillGithub,
} from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import { useLoginMutation } from "../../../redux/features/auth/authApi";
//import { useLoginMutation } from "../../../redux/features/auth/authApi";
import { getProviders, signIn } from "next-auth/react";
import toast from "react-hot-toast";
import { styles } from "@/app/styles/style";
type Props = {
  setRoute?: (route: string) => void;
  setOpen: (route: boolean) => void;
  refetch?: () => void;
};

const schema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid Email!")
    .required("Please Enter Your Email!"),
  password: Yup.string().required("Please Enter Your Password!").min(6),
});
const Login: FC<Props> = ({ setRoute, setOpen, refetch }) => {
  const [show, setShow] = useState(false);
  const [socialProviders, setSocialProviders] = useState<Record<string, boolean>>({});
  const [login, { isSuccess, error }] = useLoginMutation();
  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: schema,
    onSubmit: async ({ email, password }) => {
      await login({ email, password });
    },
  });
  const { errors, handleChange, touched, values, handleSubmit } = formik;
  useEffect(() => {
    if (isSuccess) {
      toast.success("Login Successfully!");
      refetch?.();
      setOpen(false);
    }
    if (error) {
      if ("data" in error) {
        const errorData = error as { data?: { message?: string } };
        toast.error(errorData.data?.message || "Login failed");
      }
    }
  }, [isSuccess, error, setOpen,refetch]);

  useEffect(() => {
    const loadProviders = async () => {
      const providers = await getProviders();
      setSocialProviders({
        google: !!providers?.google,
        github: !!providers?.github,
      });
    };
    void loadProviders();
  }, []);

  const handleSocialSignIn = async (provider: "google" | "github") => {
    if (!socialProviders[provider]) {
      toast.error(`${provider === "google" ? "Google" : "GitHub"} login is not configured`);
      return;
    }
    const result = await signIn(provider, { callbackUrl: "/", redirect: false });
    if (result?.error) {
      toast.error(result.error);
      return;
    }
    if (result?.url) {
      window.location.href = result.url;
      return;
    }
    toast.error("Unable to start social login");
  };

  return (
    <div className="w-full px-4 sm:px-0">
      <h1 className={`${styles.title} text-[20px] sm:text-[25px]`}>Login With ELearning</h1>
      <form onSubmit={handleSubmit} className="mt-4 sm:mt-6">
        <label className={`${styles.label}`} htmlFor="email">
          Enter Your Email
        </label>
        <input
          type="email"
          name="email"
          value={values.email}
          onChange={handleChange}
          id="email"
          placeholder="loginemail@gmail.com"
          autoComplete="email"
          className={`${errors.email && touched.email && "border-red-500"} ${
            styles.input
          }`}
        />
        {errors.email && touched.email && (
          <span className="text-red-500 pt-2 block">{errors.email}</span>
        )}
        <div className="w-full mt-4 sm:mt-5 relative mb-1">
          <label className={`${styles.label}`} htmlFor="password">
            Enter Your Password
          </label>
          <input
            type={!show ? "password" : "text"}
            name="password"
            value={values.password}
            onChange={handleChange}
            id="password"
            placeholder="passwords!@#%"
            autoComplete="current-password"
            className={`${
              errors.password && touched.password && "border-red-500"
            } ${styles.input}`}
          />
          {!show ? (
            <AiOutlineEyeInvisible
              className="absolute bottom-3 right-2 z-1 cursor-pointer"
              size={20}
              onClick={() => setShow(true)}
            />
          ) : (
            <AiOutlineEye
              className="absolute bottom-3 right-2 z-1 cursor-pointer"
              size={20}
              onClick={() => setShow(false)}
            />
          )}
          {errors.password && touched.password && (
            <span className="text-red-500 pt-2 block">{errors.password}</span>
          )}
        </div>
        <div className="w-full mt-4 sm:mt-5">
          <input type="submit" value="Login" className={`${styles.button}`} />
        </div>
        <div className="mt-4 sm:mt-6">
          <h5 className="text-center font-Poppins text-[12px] sm:text-[14px] text-black dark:text-white">
            Or Join With
          </h5>
          <div className="flex items-center justify-center my-2 sm:my-3">
            <FcGoogle
              className="cursor-pointer mr-2"
              size={24}
              onClick={() => void handleSocialSignIn("google")}
            />
            <AiFillGithub
              className="cursor-pointer mr-2"
              size={24}
              onClick={() => void handleSocialSignIn("github")}
            />
          </div>
        </div>
        <h5 className="text-center pt-3 sm:pt-4 font-Poppins text-[12px] sm:text-[14px]">
          Not have an account?{" "}
          <span
            className="text-[#2190ff] pl-1 cursor-pointer"
            onClick={() => setRoute?.("Sign-Up")}
          >
            Sign Up
          </span>
        </h5>
      </form>
      <br />
    </div>
  );
};

export default Login;
