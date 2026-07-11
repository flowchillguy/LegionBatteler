import { Button } from "@/components/ui/button";
import { useLobbyStore } from "@/stores/useLobbyStore";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "../ui/form";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "../ui/field";
import { useAuthStore } from "@/stores/useAuthStore";
import { Input } from "@/components/ui/input";

const infoUserFormSchema = z.object({
  displayName: z.string().min(1, "Tên hiển thị không thể thiếu!"),
  email: z.string().email("Email không hợp lệ!"),
  password: z
    .string()
    .min(6, "Mật khẩu phải có ít nhất 6 ký tự!")
    .or(z.literal("")),
  bio: z.string().max(500, "Tối đa 500 ký tự!"),
  passwordComfirm: z.string().min(6, "Vui lòng nhập mật khẩu"),
});

type InfoUserFormValue = z.infer<typeof infoUserFormSchema>;

export default function InfoUserForm() {
  const { user, patchProfile } = useAuthStore();
  const { setIsInfoUserFormOpen } = useLobbyStore();

  const infoUserForm = useForm<InfoUserFormValue>({
    resolver: zodResolver(infoUserFormSchema),
    defaultValues: {
      displayName: user!.displayName,
      email: user!.email,
      password: "",
      bio: user?.bio,
      passwordComfirm: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof infoUserFormSchema>) => {
    const { bio, displayName, email, password, passwordComfirm } = data;
    await patchProfile(bio, displayName, email, password, passwordComfirm);

    infoUserForm.reset();
  };

  return (
    <>
      <Card
        className="glassmorphism w-1/2 h-1/2 flex flex-col p-6 rounded-2xl outline overflow-auto scroll-smooth"
        onClick={(e) => e.stopPropagation()}
      >
        <CardHeader>
          <CardTitle>Thông tin cá nhân</CardTitle>
          <CardDescription>
            Bạn có thể thay đổi thông tin bất cứ khi nào bạn muốn. Hãy cân nhắc
            kĩ trước khi đổi thông tin.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...infoUserForm}>
            <form
              onSubmit={infoUserForm.handleSubmit(onSubmit)}
              id="info-user-form"
            >
              <FieldGroup>
                {/* username */}
                <Field className="flex flex-row">
                  <div>
                    <FieldLabel>Tên đăng nhập</FieldLabel>
                    <FieldDescription>Không thể thay đổi</FieldDescription>
                  </div>
                  <p>
                    {user?.username} - id: {user?._id.slice(0, 3)}
                  </p>
                </Field>

                {/* Display name */}
                <Field className="flex flex-row">
                  <div>
                    <FieldLabel htmlFor="displayName">Tên hiển thị</FieldLabel>
                    <FieldDescription>
                      Để nguyên nếu không đổi tên
                    </FieldDescription>
                  </div>
                  <div>
                    <Input
                      id="displayName"
                      type="text"
                      {...infoUserForm.register("displayName")}
                    />

                    {infoUserForm.formState.errors.displayName && (
                      <p className="text-destructive text-sm p-1">
                        {infoUserForm.formState.errors.displayName?.message}
                      </p>
                    )}
                  </div>
                </Field>
                {/* Email */}
                <Field className="flex flex-row">
                  <div>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <FieldDescription>
                      Để nguyên nếu không đổi email và đảm bảo email là duy nhất
                    </FieldDescription>
                  </div>
                  <div>
                    <Input
                      id="email"
                      type="email"
                      {...infoUserForm.register("email")}
                    />

                    {infoUserForm.formState.errors.email && (
                      <p className="text-destructive text-sm p-1">
                        {infoUserForm.formState.errors.email?.message}
                      </p>
                    )}
                  </div>
                </Field>

                {/* Pass word */}
                <Field className="flex flex-row">
                  <div>
                    <FieldLabel htmlFor="password">Mật khẩu mới</FieldLabel>
                    <FieldDescription>
                      Bỏ qua nếu không đổi mật khẩu
                    </FieldDescription>
                  </div>
                  <div>
                    <Input
                      id="password"
                      type="password"
                      {...infoUserForm.register("password")}
                    />

                    {infoUserForm.formState.errors.password && (
                      <p className="text-destructive text-sm p-1">
                        {infoUserForm.formState.errors.password?.message}
                      </p>
                    )}
                  </div>
                </Field>

                {/* Bio */}
                <Field className="flex flex-row">
                  <div>
                    <FieldLabel htmlFor="bio">Bio</FieldLabel>
                    <FieldDescription>
                      Có thể bỏ qua và giới hạn 500 ký tự
                    </FieldDescription>
                  </div>
                  <div>
                    <Input
                      id="bio"
                      type="string"
                      {...infoUserForm.register("bio")}
                    />

                    {infoUserForm.formState.errors.bio && (
                      <p className="text-destructive text-sm p-1">
                        {infoUserForm.formState.errors.bio?.message}
                      </p>
                    )}
                  </div>
                </Field>
              </FieldGroup>

              <FieldSeparator className="my-1" />
              <Field className="flex flex-row">
                <div>
                  <FieldLabel htmlFor="passwordComfirm">
                    Xác nhận mật khẩu hiện tại
                  </FieldLabel>
                  <FieldDescription>
                    Nhập mật khẩu hiện tại để xác nhận đổi thông tin như đã điền
                    trên!
                  </FieldDescription>
                </div>

                <div className="flex items-center">
                  <Input
                    id="passwordComfirm"
                    type="password"
                    {...infoUserForm.register("passwordComfirm")}
                  />

                  {infoUserForm.formState.errors.passwordComfirm && (
                    <p className="text-destructive text-sm p-1">
                      {infoUserForm.formState.errors.passwordComfirm?.message}
                    </p>
                  )}
                </div>
              </Field>

              <FieldSeparator className="my-1" />
            </form>
          </Form>
        </CardContent>

        <CardFooter className="flex betwent place-content-around">
          <Button
            type="button"
            variant="default"
            onClick={() => infoUserForm.reset()}
          >
            Trả về thông tin đúng
          </Button>

          <Button variant="destructive" type="submit" form="info-user-form">
            Xác nhận đổi thông tin
          </Button>

          <Button variant="default" onClick={setIsInfoUserFormOpen}>
            Quay lại game an toàn
          </Button>
        </CardFooter>
      </Card>
    </>
  );
}
