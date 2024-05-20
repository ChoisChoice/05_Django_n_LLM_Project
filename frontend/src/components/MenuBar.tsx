import { Menu, MenuButton, MenuList, MenuItem, Button } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

function MenuBar() {
  const navigate = useNavigate();

  const handleMenuClick = (path: string) => {
    navigate(path);
  };

  return (
    <Menu>
      <MenuButton as={Button}>Menu</MenuButton>
      <MenuList>
        <MenuItem onClick={() => handleMenuClick("/")}>Home</MenuItem>
        <MenuItem onClick={() => handleMenuClick("/models/summary-news/")}>
          ChatLLM
        </MenuItem>
        <MenuItem onClick={() => handleMenuClick("/boards/")}>Board</MenuItem>
      </MenuList>
    </Menu>
  );
}

export default MenuBar;
