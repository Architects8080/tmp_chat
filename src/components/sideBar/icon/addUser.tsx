type iconProps = {
  onClick: any
}

function AddUserIcon(prop: iconProps) {
  return (
    <img className="icon" src="/icons/sidebar/addUser.svg" alt="cannot load icon" onClick={prop.onClick}/>
  );
}

export default AddUserIcon;