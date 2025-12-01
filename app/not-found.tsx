import AnchorLinkBtn from "./_components/AnchorLinkBtn";

function NotFound() {
  return (
    <main className="text-center h-dvh space-y-6 content-center">
      <h1 className="text-3xl font-semibold text-secondary">
        This page could not be found :(
      </h1>
      <AnchorLinkBtn
        href="/"
        styles="inline-block py-3 leading-tight rounded-lg bg-gold text-lg hover:bg-hover
        px-6 font-semibold duration-200 transition-colors"
      >
        Go back home
      </AnchorLinkBtn>
    </main>
  );
}

export default NotFound;
