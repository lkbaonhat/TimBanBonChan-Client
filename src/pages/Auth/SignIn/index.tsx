import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Eye, EyeOff } from "lucide-react";
import styles from "../auth-form.module.css";
import { LOGO } from "@/constants/global";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.formCard}>
        <div>
          <div className={styles.logoContainer}>
            <div className={styles.logo}>
              <img src={LOGO.NO_TEXT} alt="logo" />
            </div>
          </div>

          <form className={styles.form}>
            <div className={styles.inputGroup}>
              <Input
                type="email"
                placeholder="Địa chỉ email cá nhân"
                className={styles.input}
              />
            </div>

            <div className={styles.inputGroup}>
              <div className="relative w-full">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Mật khẩu"
                  className={styles.input}
                />
                <button
                  type="button"
                  className={styles.eyeButton}
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <Button className={styles.submitButton}>Đăng nhập</Button>
          </form>

          <div className={styles.divider}>
            <Separator className={styles.separator} />
            <span className={styles.orText}>Hoặc</span>
            <Separator className={styles.separator} />
          </div>

          <div className={styles.socialButtons}>
            <button className={styles.socialButton}>
              <img src={LOGO.APP_LOGO} alt="app_logo" />
            </button>
            <button className={styles.socialButton}>
              <img src={LOGO.GG_LOGO} alt="gg_logo" />
            </button>
            <button className={styles.socialButton}>
              <img src={LOGO.FB_LOGO} alt="fb_logo" />
            </button>
          </div>

          <div className={`${styles.forgotPass} mb-10`}>
            <a href="#">Bạn quên mật khẩu?</a>
          </div>

          <div className={styles.footerText}>
            <p>
              Bạn chưa có tài khoản?{" "}
              <a href="#" className={styles.link}>
                Đăng ký ngay
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
