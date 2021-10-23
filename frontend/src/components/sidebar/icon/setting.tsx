type IconProps = {
  onClick: any;
};

const SettingIcon = (prop: IconProps) => {
  return (
    <img
      className="icon"
      src="/icons/sidebar/setting.svg"
      onClick={prop.onClick}
    />
  );
}

export default SettingIcon;
