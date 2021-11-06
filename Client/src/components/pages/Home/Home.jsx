import Feed from "../../Common/Feed/Feed";
import HomeRightBar from "../../Common/RightBar/HomeRightBar/HomeRightBar";
import Sidebar from "../../Common/SideBar/SideBar";
import TopBar from "../../Common/TopBar/TopBar";
import styles from "./home.module.scss";

const Home = () => {
	return (
		<>
			<TopBar />
			<div className={styles.homeContainer}>
				<Sidebar />
				<Feed home={true} />
				<HomeRightBar />
			</div>
		</>
	);
};

export default Home;
