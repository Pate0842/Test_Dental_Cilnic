import { useState, useCallback } from "react";

// Higher-Order Component để thêm các tính năng cho Navbar
const withNavbarEnhancements = (WrappedComponent) => {
  // Kiểm tra xem WrappedComponent có phải là một component hợp lệ không
  if (!WrappedComponent || typeof WrappedComponent !== "function") {
    console.error("withNavbarEnhancements: WrappedComponent is not a valid React component");
    return () => null; // Trả về một component rỗng để tránh crash
  }

  const EnhancedComponent = (props) => {
    // Trạng thái loading cho hành động đăng xuất
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    // Trạng thái hover cho các liên kết
    const [hoveredLink, setHoveredLink] = useState(null);

    // Hàm xử lý logout với trạng thái loading
    const enhancedHandleLogout = useCallback(async (originalHandleLogout) => {
      setIsLoggingOut(true);
      try {
        if (typeof originalHandleLogout !== "function") {
          throw new Error("originalHandleLogout is not a function");
        }
        await originalHandleLogout();
      } catch (error) {
        console.error("Error in enhancedHandleLogout:", error);
      } finally {
        setIsLoggingOut(false);
      }
    }, []);

    // Hàm xử lý hover cho các liên kết
    const handleLinkHover = useCallback((link) => {
      setHoveredLink(link);
    }, []);

    const handleLinkLeave = useCallback(() => {
      setHoveredLink(null);
    }, []);

    // Debug props trước khi truyền vào WrappedComponent
    console.log("Props passed to WrappedComponent:", {
      ...props,
      isLoggingOut,
      enhancedHandleLogout,
      handleLinkHover,
      handleLinkLeave,
      hoveredLink,
    });

    // Trả về WrappedComponent với các props mới
    return (
      <WrappedComponent
        {...props}
        isLoggingOut={isLoggingOut}
        enhancedHandleLogout={enhancedHandleLogout}
        handleLinkHover={handleLinkHover}
        handleLinkLeave={handleLinkLeave}
        hoveredLink={hoveredLink}
      />
    );
  };

  // Gán displayName cho HOC để tránh lỗi react/display-name
  EnhancedComponent.displayName = `WithNavbarEnhancements(${
    WrappedComponent.displayName || WrappedComponent.name || "Component"
  })`;

  return EnhancedComponent;
};

export default withNavbarEnhancements;