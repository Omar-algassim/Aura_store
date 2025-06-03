// import PlusIcon from "./plus.svg";
// import CloseIcon from "./close.svg";
// import BoxIcon from "./box.svg";
// import CheckCircleIcon from "./check-circle.svg";
// import AlertIcon from "./alert.svg";
// import InfoIcon from "./info.svg";
// import ErrorIcon from "./info-hexa.svg";
// import BoltIcon from "./bolt.svg";
// import ArrowUpIcon from "./arrow-up.svg";
// import ArrowDownIcon from "./arrow-down.svg";
// import FolderIcon from "./folder.svg";
// import VideoIcon from "./videos.svg";
// import AudioIcon from "./audio.svg";
// import GridIcon from "./grid.svg";
// import FileIcon from "./file.svg";
// // import DownloadIcon from "./download.svg";
// import ArrowRightIcon from "./arrow-right.svg";
// import GroupIcon from "./group.svg";
// import BoxIconLine from "./box-line.svg";
// import ShootingStarIcon from "./shooting-star.svg";
// import DollarLineIcon from "./dollar-line.svg";
// import TrashBinIcon from "./trash.svg";
// import AngleUpIcon from "./angle-up.svg";
// import AngleDownIcon from "./angle-down.svg";
// import PencilIcon from "./pencil.svg";
// import CheckLineIcon from "./check-line.svg";
// import CloseLineIcon from "./close-line.svg";
// import ChevronDownIcon from "./chevron-down.svg";
// import ChevronUpIcon from "./chevron-up.svg";
// import PaperPlaneIcon from "./paper-plane.svg";
// import LockIcon from "./lock.svg";
// import EnvelopeIcon from "./envelope.svg";
// import UserIcon from "./user-line.svg";
// import CalenderIcon from "./calender-line.svg";
// import EyeIcon from "./eye.svg";
// import EyeCloseIcon from "./eye-close.svg";
// import TimeIcon from "./time.svg";
// import CopyIcon from "./copy.svg";
// import ChevronLeftIcon from "./chevron-left.svg";
// import UserCircleIcon from "./user-circle.svg";
// import TaskIcon from "./task-icon.svg";
// import ListIcon from "./list.svg";
// import TableIcon from "./table.svg";
// import PageIcon from "./page.svg";
// import PieChartIcon from "./pie-chart.svg";
// import BoxCubeIcon from "./box-cube.svg";
// import PlugInIcon from "./plug-in.svg";
// import DocsIcon from "./docs.svg";
// import MailIcon from "./mail-line.svg";
// import HorizontaLDots from "./horizontal-dots.svg";
// import ChatIcon from "./chat.svg";
// import MoreDotIcon from "./more-dot.svg";
// import BellIcon from "./bell.svg";

import Image from "next/image";

type IconProps = {
  alt?: string;
  width?: number;
  height?: number;
  className?: string;
};

export const DownloadIcon = (props: IconProps) => (
  <Image src="./download.svg" alt={props.alt || "Download Icon"} width={props.width || 24} height={props.height || 24} />
);

export const BellIcon = (props: IconProps) => (
  <Image src="/icons/bell.svg" alt={props.alt || "Bell Icon"} width={props.width || 24} height={props.height || 24} />
);

export const MoreDotIcon = (props: IconProps) => (
  <Image src="/icons/more-dot.svg" alt={props.alt || "More Dot Icon"} width={props.width || 24} height={props.height || 24} />
);

export const FileIcon = (props: IconProps) => (
  <Image src="/icons/file.svg" alt={props.alt || "File Icon"} width={props.width || 24} height={props.height || 24} />
);

export const GridIcon = (props: IconProps) => (
  <Image src="/icons/grid.svg" alt={props.alt || "Grid Icon"} width={props.width || 24} height={props.height || 24} />
);

export const AudioIcon = (props: IconProps) => (
  <Image src="/icons/audio.svg" alt={props.alt || "Audio Icon"} width={props.width || 24} height={props.height || 24} />
);

export const VideoIcon = (props: IconProps) => (
  <Image src="/icons/videos.svg" alt={props.alt || "Video Icon"} width={props.width || 24} height={props.height || 24} />
);

export const BoltIcon = (props: IconProps) => (
  <Image src="/icons/bolt.svg" alt={props.alt || "Bolt Icon"} width={props.width || 24} height={props.height || 24} />
);

export const PlusIcon = (props: IconProps) => (
  <Image src="/icons/plus.svg" alt={props.alt || "Plus Icon"} width={props.width || 24} height={props.height || 24} />
);

export const BoxIcon = (props: IconProps) => (
  <Image src="/icons/box.svg" alt={props.alt || "Box Icon"} width={props.width || 24} height={props.height || 24} />
);

export const CloseIcon = (props: IconProps) => (
  <Image src="/icons/close.svg" alt={props.alt || "Close Icon"} width={props.width || 24} height={props.height || 24} />
);

export const CheckCircleIcon = (props: IconProps) => (
  <Image src="/icons/check-circle.svg" alt={props.alt || "Check Circle Icon"} width={props.width || 24} height={props.height || 24} />
);

export const AlertIcon = (props: IconProps) => (
  <Image src="/icons/alert.svg" alt={props.alt || "Alert Icon"} width={props.width || 24} height={props.height || 24} />
);

export const InfoIcon = (props: IconProps) => (
  <Image src="/icons/info.svg" alt={props.alt || "Info Icon"} width={props.width || 24} height={props.height || 24} />
);

export const ErrorIcon = (props: IconProps) => (
  <Image src="/icons/info-hexa.svg" alt={props.alt || "Error Icon"} width={props.width || 24} height={props.height || 24} />
);

export const ArrowUpIcon = (props: IconProps) => (
  <Image src="/icons/arrow-up.svg" alt={props.alt || "Arrow Up Icon"} width={props.width || 24} height={props.height || 24} />
);

export const ArrowDownIcon = (props: IconProps) => (
  <Image src="/icons/arrow-down.svg" alt={props.alt || "Arrow Down Icon"} width={props.width || 24} height={props.height || 24} />
);

export const ArrowRightIcon = (props: IconProps) => (
  <Image src="/icons/arrow-right.svg" alt={props.alt || "Arrow Right Icon"} width={props.width || 24} height={props.height || 24} />
);

export const GroupIcon = (props: IconProps) => (
  <Image src="/icons/group.svg" alt={props.alt || "Group Icon"} width={props.width || 24} height={props.height || 24} />
);

export const BoxIconLine = (props: IconProps) => (
  <Image src="/icons/box-line.svg" alt={props.alt || "Box Line Icon"} width={props.width || 24} height={props.height || 24} />
);

export const ShootingStarIcon = (props: IconProps) => (
  <Image src="/icons/shooting-star.svg" alt={props.alt || "Shooting Star Icon"} width={props.width || 24} height={props.height || 24} />
);

export const DollarLineIcon = (props: IconProps) => (
  <Image src="/icons/dollar-line.svg" alt={props.alt || "Dollar Line Icon"} width={props.width || 24} height={props.height || 24} />
);

export const TrashBinIcon = (props: IconProps) => (
  <Image src="/icons/trash.svg" alt={props.alt || "Trash Bin Icon"} width={props.width || 24} height={props.height || 24} />
);

export const AngleUpIcon = (props: IconProps) => (
  <Image src="/icons/angle-up.svg" alt={props.alt || "Angle Up Icon"} width={props.width || 24} height={props.height || 24} />
);

export const AngleDownIcon = (props: IconProps) => (
  <Image src="/icons/angle-down.svg" alt={props.alt || "Angle Down Icon"} width={props.width || 24} height={props.height || 24} />
);

export const PencilIcon = (props: IconProps) => (
  <Image src="/icons/pencil.svg" alt={props.alt || "Pencil Icon"} width={props.width || 24} height={props.height || 24} />
);

export const CheckLineIcon = (props: IconProps) => (
  <Image src="/icons/check-line.svg" alt={props.alt || "Check Line Icon"} width={props.width || 24} height={props.height || 24} />
);

export const CloseLineIcon = (props: IconProps) => (
  <Image src="/icons/close-line.svg" alt={props.alt || "Close Line Icon"} width={props.width || 24} height={props.height || 24} />
);

export const ChevronDownIcon = (props: IconProps) => (
  <Image src="/icons/chevron-down.svg" alt={props.alt || "Chevron Down Icon"} width={props.width || 24} height={props.height || 24} />
);

export const PaperPlaneIcon = (props: IconProps) => (
  <Image src="/icons/paper-plane.svg" alt={props.alt || "Paper Plane Icon"} width={props.width || 24} height={props.height || 24} />
);

export const EnvelopeIcon = (props: IconProps) => (
  <Image src="/icons/envelope.svg" alt={props.alt || "Envelope Icon"} width={props.width || 24} height={props.height || 24} />
);

export const LockIcon = (props: IconProps) => (
  <Image src="/icons/lock.svg" alt={props.alt || "Lock Icon"} width={props.width || 24} height={props.height || 24} />
);

export const UserIcon = (props: IconProps) => (
  <Image src="/icons/user-line.svg" alt={props.alt || "User Icon"} width={props.width || 24} height={props.height || 24} />
);

export const CalenderIcon = (props: IconProps) => (
  <Image src="/icons/calender-line.svg" alt={props.alt || "Calendar Icon"} width={props.width || 24} height={props.height || 24} />
);

export const EyeIcon = (props: IconProps) => (
  <Image src="/icons/eye.svg" alt={props.alt || "Eye Icon"} width={props.width || 24} height={props.height || 24} />
);

export const EyeCloseIcon = (props: IconProps) => (
  <Image src="/icons/eye-close.svg" alt={props.alt || "Eye Close Icon"} width={props.width || 24} height={props.height || 24} />
);

export const TimeIcon = (props: IconProps) => (
  <Image src="/icons/time.svg" alt={props.alt || "Time Icon"} width={props.width || 24} height={props.height || 24} />
);

export const CopyIcon = (props: IconProps) => (
  <Image src="/icons/copy.svg" alt={props.alt || "Copy Icon"} width={props.width || 24} height={props.height || 24} />
);

export const ChevronLeftIcon = (props: IconProps) => (
  <Image src="/icons/chevron-left.svg" alt={props.alt || "Chevron Left Icon"} width={props.width || 24} height={props.height || 24} />
);

export const UserCircleIcon = (props: IconProps) => (
  <Image src="/icons/user-circle.svg" alt={props.alt || "User Circle Icon"} width={props.width || 24} height={props.height || 24} />
);

export const ListIcon = (props: IconProps) => (
  <Image src="/icons/list.svg" alt={props.alt || "List Icon"} width={props.width || 24} height={props.height || 24} />
);

export const TableIcon = (props: IconProps) => (
  <Image src="/icons/table.svg" alt={props.alt || "Table Icon"} width={props.width || 24} height={props.height || 24} />
);

export const PageIcon = (props: IconProps) => (
  <Image src="/icons/page.svg" alt={props.alt || "Page Icon"} width={props.width || 24} height={props.height || 24} />
);

export const TaskIcon = (props: IconProps) => (
  <Image src="/icons/task-icon.svg" alt={props.alt || "Task Icon"} width={props.width || 24} height={props.height || 24} />
);

export const PieChartIcon = (props: IconProps) => (
  <Image src="/icons/pie-chart.svg" alt={props.alt || "Pie Chart Icon"} width={props.width || 24} height={props.height || 24} />
);

export const BoxCubeIcon = (props: IconProps) => (
  <Image src="/icons/box-cube.svg" alt={props.alt || "Box Cube Icon"} width={props.width || 24} height={props.height || 24} />
);

export const PlugInIcon = (props: IconProps) => (
  <Image src="/icons/plug-in.svg" alt={props.alt || "Plug In Icon"} width={props.width || 24} height={props.height || 24} />
);

export const DocsIcon = (props: IconProps) => (
  <Image src="/icons/docs.svg" alt={props.alt || "Docs Icon"} width={props.width || 24} height={props.height || 24} />
);

export const MailIcon = (props: IconProps) => (
  <Image src="/icons/mail-line.svg" alt={props.alt || "Mail Icon"} width={props.width || 24} height={props.height || 24} />
);

export const HorizontaLDots = (props: IconProps) => (
  <Image src="/icons/horizontal-dots.svg" alt={props.alt || "Horizontal Dots Icon"} width={props.width || 24} height={props.height || 24} />
);

export const ChevronUpIcon = (props: IconProps) => (
  <Image src="/icons/chevron-up.svg" alt={props.alt || "Chevron Up Icon"} width={props.width || 24} height={props.height || 24} />
);

export const ChatIcon = (props: IconProps) => (
  <Image src="/icons/chat.svg" alt={props.alt || "Chat Icon"} width={props.width || 24} height={props.height || 24} />
);

export const FolderIcon = (props: IconProps) => (
  <Image src="/icons/folder.svg" alt={props.alt || "Folder Icon"} width={props.width || 24} height={props.height || 24} />
);

// export {
//   // DownloadIcon,
//   BellIcon,
//   MoreDotIcon,
//   FileIcon,
//   GridIcon,
//   AudioIcon,
//   VideoIcon,
//   BoltIcon,
//   PlusIcon,
//   BoxIcon,
//   CloseIcon,
//   CheckCircleIcon,
//   AlertIcon,
//   InfoIcon,
//   ErrorIcon,
//   ArrowUpIcon,
//   FolderIcon,
//   ArrowDownIcon,
//   ArrowRightIcon,
//   GroupIcon,
//   BoxIconLine,
//   ShootingStarIcon,
//   DollarLineIcon,
//   TrashBinIcon,
//   AngleUpIcon,
//   AngleDownIcon,
//   PencilIcon,
//   CheckLineIcon,
//   CloseLineIcon,
//   ChevronDownIcon,
//   PaperPlaneIcon,
//   EnvelopeIcon,
//   LockIcon,
//   UserIcon,
//   CalenderIcon,
//   EyeIcon,
//   EyeCloseIcon,
//   TimeIcon,
//   CopyIcon,
//   ChevronLeftIcon,
//   UserCircleIcon,
//   ListIcon,
//   TableIcon,
//   PageIcon,
//   TaskIcon,
//   PieChartIcon,
//   BoxCubeIcon,
//   PlugInIcon,
//   DocsIcon,
//   MailIcon,
//   HorizontaLDots,
//   ChevronUpIcon,
//   ChatIcon,
// };
