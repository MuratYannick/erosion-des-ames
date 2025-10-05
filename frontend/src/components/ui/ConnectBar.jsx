import PrimaryButton from "./PrimaryButton";
import SecondaryButton from "./SecondaryButton";

function ConnectBar() {
  return (
    <div className="flex justify-end grow gap-2 p-2">
      <PrimaryButton className="text-sm tracking-widest h-10 w-25">
        Connexion
      </PrimaryButton>
      <SecondaryButton className="text-sm tracking-widest h-10 w-25">
        Inscription
      </SecondaryButton>
    </div>
  );
}

export default ConnectBar;
