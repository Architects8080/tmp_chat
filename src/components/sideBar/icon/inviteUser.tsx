type iconProps = {
  onClick: any;
};

function InviteUserIcon(prop: iconProps) {
  return (
    <img
      className="icon"
      src="/icons/sidebar/inviteUser.svg"
      onClick={prop.onClick}
    />
  );
}

export default InviteUserIcon;
