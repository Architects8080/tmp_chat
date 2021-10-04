type iconProps = {
  onClick: any
}

function SettingIcon(prop: iconProps) {
  return (
    <img className="icon" src="/icons/sidebar/setting.svg" onClick={prop.onClick}/>
    );
}

export default SettingIcon;