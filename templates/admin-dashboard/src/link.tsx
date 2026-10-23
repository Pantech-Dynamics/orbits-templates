import type { AnchorHTMLAttributes, MouseEvent } from "react";
import { navigate, usePath } from "./router";

export function Link({ href, onClick, ...props }: AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) {
  const path = usePath();
  const follow = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    // Let the browser handle new tabs, downloads and other origins.
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || props.target) return;
    e.preventDefault();
    navigate(href);
  };
  return <a href={href} onClick={follow} aria-current={path === href ? "page" : undefined} {...props} />;
}
