import AnchorLinkBtn from "./AnchorLinkBtn";

export default function Header() {
  return (
    <header className="text-secondary flex items-center justify-between px-10 py-6">
      <div>logo</div>

      <ul className="flex items-center justify-center gap-20 text-md">
        <AnchorLinkBtn
          styles="text-secondary/80 hover:text-hover focus-visible:outline-none"
          href="/"
        >
          Home
        </AnchorLinkBtn>
        <AnchorLinkBtn
          styles="text-secondary/80 hover:text-hover focus-visible:outline-none"
          href="/"
        >
          About
        </AnchorLinkBtn>
        <AnchorLinkBtn
          styles="text-secondary/80 hover:text-hover focus-visible:outline-none"
          href="/"
        >
          Contact
        </AnchorLinkBtn>
      </ul>

      <ul className="flex items-center justify-center gap-5 text-md">
        <AnchorLinkBtn
          styles="rounded-sm bg-hover px-5 hover:text-secondary
          focus-visible:outline-none hover:bg-borders py-1"
          href="/login"
        >
          Login
        </AnchorLinkBtn>
        <AnchorLinkBtn
          styles="rounded-sm bg-secondary px-5 hover:text-secondary
          focus-visible:outline-none hover:bg-borders py-1"
          href="/signup"
        >
          Signup
        </AnchorLinkBtn>
      </ul>
    </header>
  );
}
