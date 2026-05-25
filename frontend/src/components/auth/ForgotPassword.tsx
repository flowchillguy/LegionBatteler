import z from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "../ui/form";
import { Field } from "../ui/field";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/useAuthStore";
import useCountdown from "@/hooks/useCountdown";
import { useState } from "react";

const LOCKOUT_DURATION = 10;

const userNameFormSchema = z.object({
  username: z
    .string()
    .min(3, "Tên đăng nhập phải có ít nhất 3 kí tự!")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Tên đăng nhập không được chứa khoảng trắng và kí tự đặc biệt!",
    ),
});

type UserNameFormValue = z.infer<typeof userNameFormSchema>;

export default function ForgotPassword() {
  const { getPassword } = useAuthStore();
  const [isLockedComfirm, setCountdown, timeLeft] =
    useCountdown(LOCKOUT_DURATION);

  const [maskingEmail, setMaskingEmail] = useState();
  const userNameForm = useForm<UserNameFormValue>({
    resolver: zodResolver(userNameFormSchema),
    defaultValues: { username: "" },
  });

  const onSubmit = async (data: z.infer<typeof userNameFormSchema>) => {
    if (isLockedComfirm) {
      toast.error(`Vui lòng đợi ${timeLeft} giây rồi thử lại!`);
      return;
    }

    setCountdown();

    const { username } = data;

    const maskingEmail = await getPassword(username);

    setMaskingEmail(maskingEmail);
  };

  return (
    <Card
      className="glassmorphism w-1/2 h-1/2 flex flex-col p-6 rounded-2xl outline overflow-auto scroll-smooth"
      onClick={(e) => e.stopPropagation()}
    >
      <CardHeader>
        <CardTitle>Quên mật khẩu</CardTitle>
        <CardDescription className="scale-110">
          <p>Thực hiện các bước sau để lấy lại tài khoản</p>
          <p>1. Nhập tên đăng nhập tài khoản của bạn và bấm xác nhận</p>
          <p>2. Mở email bạn đã đăng kí để nhận mật khẩu mới</p>
          <p>3. Click vào vùng tối để thoát</p>
          <p>4. Đăng nhập lại bằng mật khẩu mới</p>
          <p>5. Sau khi đăng nhập hãy đổi mật khẩu</p>
          <p>
            Note: hãy kiểm tra tin rác nếu không thấy email hoặc thử lại sau ít
            phút
          </p>
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Form {...userNameForm}>
          <form
            onSubmit={userNameForm.handleSubmit(onSubmit)}
            id="usename-form"
            className="flex flex-col justify-center items-center gap-5"
          >
            <Field className="flex flex-colum w-80">
              <Input
                id="username"
                type="text"
                {...userNameForm.register("username")}
                placeholder="Nhập tên đăng nhập của bạn ở đây!"
                className="text-center"
              />

              {userNameForm.formState.errors.username && (
                <p className="text-destructive text-sm p-1">
                  {userNameForm.formState.errors.username?.message}
                </p>
              )}
            </Field>

            <Button
              type="submit"
              form="usename-form"
              disabled={isLockedComfirm}
              variant={`${isLockedComfirm ? "ghost" : "default"}`}
            >
              {isLockedComfirm
                ? `Vui lòng kiểm tra email ${maskingEmail}. Nếu không được hãy thử lại sau ${timeLeft}s`
                : "Xác nhận"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
