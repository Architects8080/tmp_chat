type IconProps = {
  onClick: any;
};

const InviteUserIcon = (prop: IconProps) => {
  return (
    <img
      className="icon"
      src="/icons/sidebar/inviteUser.svg"
      onClick={prop.onClick}
    />
  );
}

export default InviteUserIcon;
