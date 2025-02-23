"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EyeClosedIcon, EyeIcon } from "lucide-react";
import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { useLogin } from "@/hooks/api/useAuth";
import { toast } from "@/hooks/use-toast";
import cookie from "@/utils/cookie";
import { GlobalContext } from "@/provider/global-provider";
import { useRouter, useSearchParams } from "next/navigation";
import LoadingIndicator from "@/app/components/LoadingIndicator";

const LoginSchema = z.object({
  email: z.string().email("Vui lòng nhập email hợp lệ"),
  password: z.string().min(1, "Vui lòng nhập mật khẩu"),
});

type LoginForm = z.infer<typeof LoginSchema>;

export default function Login() {
  const [isShowPassword, setIsShowPassword] = useState(false);
  const { setUser } = useContext(GlobalContext);
  const searchParams = useSearchParams();
  const router = useRouter();
  const from = searchParams.get("from");

  const loginMutation = useLogin();

  const { handleSubmit, register, formState } = useForm<LoginForm>({
    resolver: zodResolver(LoginSchema),
  });

  const onSubmit = (data: LoginForm) => {
    loginMutation.mutate(
      {
        email: data.email,
        password: data.password,
      },
      {
        onSuccess: (data) => {
          if (data.isSuccess) {
            const { token, refreshToken, account } = data.result;
            cookie.set("ACCESS_TOKEN", token);
            cookie.set("REFRESH_TOKEN", refreshToken);
            setUser(account);
            localStorage.setItem("user", JSON.stringify(account));
            if (account.mainRole === "COLLECTOR") {
              router.push(!!from ? `/${from}` : "/");
            } else {
              router.push("/management");
            }
          } else {
            toast({
              title: data.messages[0],
            });
          }
        },
      }
    );
  };

  return (
    <div className="h-screen flex items-center justify-center">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Đăng nhập</CardTitle>
          <CardDescription>
            Bạn chưa có tài khoản?{" "}
            <Link href="register" className="text-blue-500 underline">
              Đăng ký ngay
            </Link>
          </CardDescription>
        </CardHeader>
        <CardContent>
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
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="framework">Mật khẩu</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={isShowPassword ? "text" : "password"}
                    placeholder="Nhập mật khẩu"
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
            </div>
          </form>
          <Link
            href="/reset-password"
            className="text-blue-500 underline mt-2 text-sm"
          >
            Quên mật khẩu?
          </Link>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            form="login-form"
            disabled={loginMutation.isPending}
            className="w-full bg-[#E12E43] text-white hover:bg-[#B71C32]"
            onClick={handleSubmit(onSubmit)}
          >
            {loginMutation.isPending ? <LoadingIndicator /> : "Đăng nhập"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
