type IconProps = {
  onClick: any;
};

const AddUserIcon = (prop: IconProps) => {
  return (
    <img
      className="icon"
      src="/icons/sidebar/addUser.svg"
      alt="cannot load icon"
      onClick={prop.onClick}
    />
  );
}

export default AddUserIcon;
