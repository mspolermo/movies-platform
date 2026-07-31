import ArrowLeftIcon from '../assets/arrowLeft.svg';
import ArrowRightIcon from '../assets/arrowRight.svg';
import BackArrowIcon from '../assets/backArrow.svg';
import BookmarkIcon from '../assets/bookmark.svg';
import BookmarkFilledIcon from '../assets/bookmarkFilled.svg';
import CheckmarkIcon from '../assets/checkmark.svg';
import ChevronIcon from '../assets/chevron.svg';
import CircleFilledIcon from '../assets/circleFilled.svg';
import CloseIcon from '../assets/close.svg';
import CopyIcon from '../assets/copy.svg';
import DevicesIcon from '../assets/devices.svg';
import DotsHorizontalIcon from '../assets/dotsHorizontal.svg';
import FiltersIcon from '../assets/filters.svg';
import HomeIcon from '../assets/home.svg';
import ImageIcon from '../assets/image.svg';
import KeyboardIcon from '../assets/keyboard.svg';
import LikeIcon from '../assets/like.svg';
import MuteIcon from '../assets/mute.svg';
import PersonIcon from '../assets/person.svg';
import QuoteCloseIcon from '../assets/quoteClose.svg';
import QuoteOpenIcon from '../assets/quoteOpen.svg';
import RateIcon from '../assets/rate.svg';
import RateDownIcon from '../assets/rateDown.svg';
import SearchIcon from '../assets/search.svg';
import ShareIcon from '../assets/share.svg';
import SortIcon from '../assets/sort.svg';
import TvIcon from '../assets/tv.svg';
import VolumeDownIcon from '../assets/volumeDown.svg';

/**
 * Реестр иконок: ключ camelCase → SVG из `../assets/<key>.svg` (SVGR).
 * Новая иконка: файл `assets/<key>.svg` + запись здесь.
 *
 * `rate` / `like` — thumbs-up; `rateDown` — thumbs-down (оценка ≤ 6).
 */
export const iconsLibrary = {
  arrowLeft: ArrowLeftIcon,
  arrowRight: ArrowRightIcon,
  backArrow: BackArrowIcon,
  bookmark: BookmarkIcon,
  bookmarkFilled: BookmarkFilledIcon,
  checkmark: CheckmarkIcon,
  chevron: ChevronIcon,
  circleFilled: CircleFilledIcon,
  close: CloseIcon,
  copy: CopyIcon,
  devices: DevicesIcon,
  dotsHorizontal: DotsHorizontalIcon,
  filters: FiltersIcon,
  home: HomeIcon,
  image: ImageIcon,
  keyboard: KeyboardIcon,
  like: LikeIcon,
  mute: MuteIcon,
  person: PersonIcon,
  quoteClose: QuoteCloseIcon,
  quoteOpen: QuoteOpenIcon,
  rate: RateIcon,
  rateDown: RateDownIcon,
  search: SearchIcon,
  share: ShareIcon,
  sort: SortIcon,
  tv: TvIcon,
  volumeDown: VolumeDownIcon,
} as const;

/** Ключ зарегистрированной иконки (автокомплит для пропа `icon`). */
export type TSvgIconName = keyof typeof iconsLibrary;
