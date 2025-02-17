"use client";
import axiosClient from "@/axios-client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useResetPassword } from "@/hooks/api/useAuth";
import { toast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { EyeClosedIcon, EyeIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const ResetPasswordSchema = z.object({
  email: z.string().email("Vui lòng nhập email hợp lệ"),
});

const FormResetPasswordSchema = z
  .object({
    recoveryCode: z.string().min(1, "Vui lòng nhập mã khôi phục"),
    password: z.string().min(1, "Vui lòng nhập mật khẩu mới"),
    confirmPassword: z.string().min(1, "Vui lòng nhập lại mật khẩu mới"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu không khớp",
    path: ["confirmPassword"],
  });

type ResetPasswordForm = z.infer<typeof ResetPasswordSchema>;
type FormResetPasswordForm = z.infer<typeof FormResetPasswordSchema>;

function FormResetPassword({ email }: { email: string }) {
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [isShowRePassword, setIsShowRePassword] = useState(false);

  const resetPasswordMutation = useResetPassword();

  const { handleSubmit, register, formState } = useForm<FormResetPasswordForm>({
    resolver: zodResolver(FormResetPasswordSchema),
  });

  const onSubmit = (data: FormResetPasswordForm) => {
    resetPasswordMutation.mutate(
      {
        email,
        recoveryCode: data.recoveryCode,
        newPassword: data.password,
      },
      {
        onSuccess: (data) => {
          if (data.isSuccess) {
            toast({
              title: data.message[0],
            });
          }
        },
      }
    );
  };

  return (
    <form id="reset-password-form" className="grid gap-4">
      <div className="flex flex-col space-y-1.5">
        <Label htmlFor="name">Mã khôi phục</Label>
        <Input
          id="recoveryCode"
          placeholder="Nhập mã khôi phục"
          {...register("recoveryCode")}
        />
        {formState.errors.recoveryCode && (
          <p className="text-red-500 text-sm">
            {formState.errors.recoveryCode.message}
          </p>
        )}
      </div>
      <div className="flex flex-col space-y-1.5">
        <Label htmlFor="framework">Mật khẩu mới</Label>
        <div className="relative">
          <Input
            id="password"
            type={isShowPassword ? "text" : "password"}
            placeholder="Nhập mật khẩu mới"
            className="pr-10"
            {...register("password")}
          />
          {isShowPassword ? (
            <EyeIcon
              className="w-4 h-4 absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer"
              onClick={() => setIsShowPassword(false)}
            />
          ) : (
            <EyeClosedIcon
              className="w-4 h-4 absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer"
              onClick={() => setIsShowPassword(true)}
            />
          )}
        </div>
        {formState.errors.password && (
          <p className="text-red-500 text-sm">
            {formState.errors.password.message}
          </p>
        )}
      </div>
      <div className="flex flex-col space-y-1.5">
        <Label htmlFor="framework">Xác nhận mật khẩu mới</Label>
        <div className="relative">
          <Input
            id="confirmPassword"
            type={isShowRePassword ? "text" : "password"}
            placeholder="Nhập lại mật khẩu mới"
            className="pr-10"
            {...register("confirmPassword")}
          />
          {isShowRePassword ? (
            <EyeIcon
              className="w-4 h-4 absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer"
              onClick={() => setIsShowRePassword(false)}
            />
          ) : (
            <EyeClosedIcon
              className="w-4 h-4 absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer"
              onClick={() => setIsShowRePassword(true)}
            />
          )}
        </div>
        {formState.errors.password && (
          <p className="text-red-500 text-sm">
            {formState.errors.password.message}
          </p>
        )}
      </div>
      <Button
        form="reset-password-form"
        className="w-full bg-[#E12E43] text-white hover:bg-[#B71C32]"
        onClick={handleSubmit(onSubmit)}
      >
        Gửi
      </Button>
    </form>
  );
}

export default function Page() {
  const [isValidated, setIsValidated] = useState(false);

  const { handleSubmit, register, formState, getValues } =
    useForm<ResetPasswordForm>({
      resolver: zodResolver(ResetPasswordSchema),
    });

  const onSubmit = async (data: ResetPasswordForm) => {
    try {
      const response = await axiosClient.post(
        "/account/send-email-forgot-password",
        data.email,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log({ response });
      if (response.data.isSuccess) {
        setIsValidated(true);
      }
    } catch (error) {
      console.log({ error });
    }
  };

  return (
    <div className="h-screen flex items-center justify-center">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Đặt lại mật khẩu</CardTitle>
          <CardDescription>
            {isValidated ? "Nhập mật khẩu mới" : "Nhập email của bạn"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isValidated ? (
            <FormResetPassword email={getValues("email")} />
          ) : (
            <form id="login-form" className="mb-2">
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="name">Email</Label>
                  <Input
                    id="email"
                    placeholder="Nhập email"
                    {...register("email")}
                  />
                  {formState.errors.email && (
                    <p className="text-red-500 text-sm">
                      {formState.errors.email.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="mt-2 text-sm">
                Bạn đã có tài khoản?{" "}
                <Link href="login" className="text-blue-500 underline">
                  Đăng nhập
                </Link>
              </div>
              <Button
                form={isValidated ? "reset-password-form" : "login-form"}
                className="w-full mt-4 bg-[#E12E43] text-white hover:bg-[#B71C32]"
                onClick={handleSubmit(onSubmit)}
              >
                Gửi
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
