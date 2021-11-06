import React from "react";
import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";

const EventModal = (props) => {
	const { component, open, setOpen } = props;
	return (
		<Modal
			open={open}
			onClose={() => setOpen(!open)}
			style={{ padding: "10px" }}
			center={true}
			closeOnEsc={false}
			closeOnOverlayClick={false}
			blockScroll={true}
		>
			{component || props.children}
		</Modal>
	);
};

export default EventModal;
