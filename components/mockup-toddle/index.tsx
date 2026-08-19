import React from "react";
import "./index.css";

/* ------------------------------------------------------------------
   Captured inline SVG icons from the live page (index.json -> icons)
   ------------------------------------------------------------------ */

const IcSmile = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M10.4749 10.4749C10.6701 10.2796 10.6701 9.96303 10.4749 9.76777C10.2796 9.5725 9.96303 9.5725 9.76777 9.76777C8.79146 10.7441 7.20854 10.7441 6.23223 9.76777C6.03697 9.5725 5.72039 9.5725 5.52513 9.76777C5.32986 9.96303 5.32986 10.2796 5.52513 10.4749C6.89196 11.8417 9.10804 11.8417 10.4749 10.4749Z" fill="#F04F7B" />
    <path d="M10.25 7.5C10.6642 7.5 11 7.16422 11 6.75C11 6.33579 10.6642 6 10.25 6C9.83579 6 9.5 6.33579 9.5 6.75C9.5 7.16422 9.83579 7.5 10.25 7.5Z" fill="#F04F7B" />
    <path d="M6.5 6.75C6.5 7.16422 6.16421 7.5 5.75 7.5C5.33579 7.5 5 7.16422 5 6.75C5 6.33579 5.33579 6 5.75 6C6.16421 6 6.5 6.33579 6.5 6.75Z" fill="#F04F7B" />
    <path fillRule="evenodd" clipRule="evenodd" d="M8 1C4.13401 1 1 4.13401 1 8C1 11.866 4.13401 15 8 15C11.866 15 15 11.866 15 8C15 4.13401 11.866 1 8 1ZM2 8C2 4.68629 4.68629 2 8 2C11.3137 2 14 4.68629 14 8C14 11.3137 11.3137 14 8 14C4.68629 14 2 11.3137 2 8Z" fill="#F04F7B" />
  </svg>
);

const IcReport = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M11.3536 4.64645C11.4015 4.69438 11.4377 4.74964 11.4621 4.80861C11.4865 4.86756 11.5 4.93221 11.5 5V7C11.5 7.27614 11.2761 7.5 11 7.5C10.7239 7.5 10.5 7.27614 10.5 7V6.20711L8.35355 8.35355C8.15829 8.54882 7.84171 8.54882 7.64645 8.35355L6.5 7.20711L5.35355 8.35355C5.15829 8.54882 4.84171 8.54882 4.64645 8.35355C4.45118 8.15829 4.45118 7.84171 4.64645 7.64645L6.14645 6.14645C6.34171 5.95118 6.65829 5.95118 6.85355 6.14645L8 7.29289L9.79289 5.5H9C8.72386 5.5 8.5 5.27614 8.5 5C8.5 4.72386 8.72386 4.5 9 4.5H11C11.128 4.5 11.2559 4.54882 11.3536 4.64645Z" fill="#F04F7B" />
    <path d="M4.5 11C4.5 10.7239 4.72386 10.5 5 10.5H11C11.2761 10.5 11.5 10.7239 11.5 11C11.5 11.2761 11.2761 11.5 11 11.5H5C4.72386 11.5 4.5 11.2761 4.5 11Z" fill="#F04F7B" />
    <path fillRule="evenodd" clipRule="evenodd" d="M2 3.5C2 2.11929 3.11929 1 4.5 1H11.5C12.8807 1 14 2.11929 14 3.5V12.5C14 13.8807 12.8807 15 11.5 15H4.5C3.11929 15 2 13.8807 2 12.5V3.5ZM4.5 2C3.67157 2 3 2.67157 3 3.5V12.5C3 13.3284 3.67157 14 4.5 14H11.5C12.3284 14 13 13.3284 13 12.5V3.5C13 2.67157 12.3284 2 11.5 2H4.5Z" fill="#F04F7B" />
  </svg>
);

const IcHeart = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path fillRule="evenodd" clipRule="evenodd" d="M5.10173 3C3.3898 3 2 4.39138 2 6.1102C2 6.8846 2.2816 7.59165 2.74815 8.13606L2.75412 8.14302L2.91652 8.34723C4.32524 10.1186 5.99537 11.664 7.86921 12.9302C8.01293 13.0273 8.20198 13.0227 8.34094 12.9188L8.67928 12.6656C10.2116 11.519 11.5952 10.1852 12.798 8.69498L13.2147 8.17869L13.2219 8.17043C13.7064 7.62157 14 6.90095 14 6.1102C14 4.39138 12.6102 3 10.8983 3C9.87573 3 8.9684 3.49567 8.40241 4.26318L8 4.80888L7.59759 4.26318C7.0316 3.49567 6.12427 3 5.10173 3ZM1 6.1102C1 3.8413 2.8353 2 5.10173 2C6.23378 2 7.25847 2.45988 8 3.2018C8.74153 2.45988 9.76622 2 10.8983 2C13.1647 2 15 3.8413 15 6.1102C15 7.14952 14.6144 8.09993 13.9792 8.82362L13.5761 9.32304C12.3211 10.8779 10.8774 12.2698 9.27839 13.4663L8.94005 13.7194C8.46017 14.0785 7.80597 14.0943 7.30934 13.7587C5.35111 12.4356 3.60587 10.8206 2.13386 8.96967L1.98269 8.77959C1.37021 8.06157 1 7.12851 1 6.1102Z" fill="#F04F7B" />
  </svg>
);

const IcTarget = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path fillRule="evenodd" clipRule="evenodd" d="M13.2907 3.41637C14.3556 4.64443 15 6.24696 15 8C15 11.866 11.866 15 8 15C4.13401 15 1 11.866 1 8C1 4.13401 4.13401 1 8 1C9.75304 1 11.3556 1.64441 12.5836 2.70926L13.6464 1.64645C13.8417 1.45118 14.1583 1.45118 14.3536 1.64645C14.5488 1.84171 14.5488 2.15829 14.3536 2.35355L13.2907 3.41637ZM2 8C2 4.68629 4.68629 2 8 2C9.47685 2 10.8291 2.53358 11.8744 3.41847L10.4528 4.84007C9.77548 4.31354 8.92436 4 8 4C5.79086 4 4 5.79086 4 8C4 10.2091 5.79086 12 8 12C10.2091 12 12 10.2091 12 8C12 7.07564 11.6865 6.22452 11.1599 5.54718L12.5815 4.12558C13.4664 5.17092 14 6.52315 14 8C14 11.3137 11.3137 14 8 14C4.68629 14 2 11.3137 2 8ZM9.73827 5.55463C9.24786 5.2054 8.64792 5 8 5C6.34315 5 5 6.34315 5 8C5 9.65685 6.34315 11 8 11C9.65685 11 11 9.65685 11 8C11 7.35208 10.7946 6.75214 10.4454 6.26173L8.96613 7.74098C8.98822 7.82359 9 7.91042 9 8C9 8.55228 8.55228 9 8 9C7.44772 9 7 8.55228 7 8C7 7.44772 7.44772 7 8 7C8.08958 7 8.17641 7.01178 8.25902 7.03387L9.73827 5.55463Z" fill="#5E5EF2" />
  </svg>
);

const IcPresentation = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path fillRule="evenodd" clipRule="evenodd" d="M5.66795 12.6763H3C2.17157 12.6763 1.5 12.0047 1.5 11.1763V6.17627C1.5 5.34784 2.17157 4.67627 3 4.67627H6.20618C6.90595 3.09964 8.4852 2 10.3213 2C12.8066 2 14.8213 4.01472 14.8213 6.5C14.8213 7.97344 14.1131 9.28149 13.0186 10.1024L14.4195 12.302C14.7157 12.7672 14.6749 13.3013 14.4162 13.7035C14.1608 14.1007 13.7012 14.3638 13.1659 14.3638H7.08656C6.55129 14.3638 6.09173 14.1007 5.8363 13.7035C5.64502 13.4061 5.57285 13.0367 5.66795 12.6763ZM6.82129 6.5C6.82129 4.567 8.38829 3 10.3213 3C12.2543 3 13.8213 4.567 13.8213 6.5C13.8213 7.61878 13.2964 8.61496 12.4794 9.25567L11.3798 7.5291C11.0889 7.07235 10.5913 6.86377 10.1263 6.86377C9.66121 6.86377 9.16361 7.07235 8.87273 7.5291L7.91154 9.03834C7.24 8.40061 6.82129 7.49921 6.82129 6.5ZM7.36653 9.89411C6.41969 9.06914 5.82129 7.85445 5.82129 6.5C5.82129 6.21865 5.84711 5.94332 5.89651 5.67627H3C2.72386 5.67627 2.5 5.90013 2.5 6.17627V11.1763C2.5 11.4524 2.72386 11.6763 3 11.6763H6.23153L7.36653 9.89411ZM9.7162 8.06628C9.79378 7.94446 9.94374 7.86377 10.1263 7.86377C10.3088 7.86377 10.4587 7.94446 10.5363 8.06627L13.576 12.8391C13.6464 12.9497 13.6398 13.0621 13.5752 13.1626C13.5073 13.2681 13.3676 13.3638 13.1659 13.3638H7.08656C6.8849 13.3638 6.74523 13.2681 6.67735 13.1626C6.61275 13.0621 6.60613 12.9497 6.67651 12.8391L9.7162 8.06628Z" fill="#5E5EF2" />
  </svg>
);

const IcShieldPlus = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M7.87873 2.04618C7.95835 2.02627 8.04165 2.02627 8.12127 2.04618L13.1213 3.29618C13.3439 3.35182 13.5 3.55182 13.5 3.78125V7.50047C13.5 7.77662 13.7239 8.00047 14 8.00047C14.2761 8.00047 14.5 7.77662 14.5 7.50047V3.78125C14.5 3.09295 14.0316 2.49297 13.3638 2.32604L8.3638 1.07604C8.12494 1.01632 7.87506 1.01632 7.6362 1.07604L2.6362 2.32604C1.96845 2.49297 1.5 3.09295 1.5 3.78125V6.66714C1.5 10.0986 3.56327 13.1935 6.73077 14.5133L7.80769 14.962C8.06259 15.0682 8.35533 14.9477 8.46154 14.6928C8.56775 14.4379 8.44721 14.1451 8.19231 14.0389L7.11538 13.5902C4.32053 12.4257 2.5 9.69489 2.5 6.66714V3.78125C2.5 3.55182 2.65615 3.35182 2.87873 3.29618L7.87873 2.04618Z" fill="#5E5EF2" />
    <path d="M11.3536 6.35403C11.5488 6.15877 11.5488 5.84218 11.3536 5.64692C11.1583 5.45166 10.8417 5.45166 10.6464 5.64692L7.5 8.79337L6.35355 7.64692C6.15829 7.45166 5.84171 7.45166 5.64645 7.64692C5.45118 7.84218 5.45118 8.15876 5.64645 8.35403L7.14645 9.85403C7.34171 10.0493 7.65829 10.0493 7.85355 9.85403L11.3536 6.35403Z" fill="#5E5EF2" />
    <path d="M9 12.0005C9 11.7243 9.22386 11.5005 9.5 11.5005H11.5V9.50047C11.5 9.22433 11.7239 9.00047 12 9.00047C12.2761 9.00047 12.5 9.22433 12.5 9.50047V11.5005H14.5C14.7761 11.5005 15 11.7243 15 12.0005C15 12.2766 14.7761 12.5005 14.5 12.5005H12.5V14.5005C12.5 14.7766 12.2761 15.0005 12 15.0005C11.7239 15.0005 11.5 14.7766 11.5 14.5005V12.5005H9.5C9.22386 12.5005 9 12.2766 9 12.0005Z" fill="#5E5EF2" />
  </svg>
);

const IcPlan = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M5.5 5C5.22386 5 5 5.22386 5 5.5C5 5.77614 5.22386 6 5.5 6L10.5 6C10.7761 6 11 5.77614 11 5.5C11 5.22386 10.7761 5 10.5 5L5.5 5Z" fill="#D97B00" />
    <path d="M7 8C7 7.72386 7.22386 7.5 7.5 7.5H10.5C10.7761 7.5 11 7.72386 11 8C11 8.27614 10.7761 8.5 10.5 8.5H7.5C7.22386 8.5 7 8.27614 7 8Z" fill="#D97B00" />
    <path d="M7.5 10C7.22386 10 7 10.2239 7 10.5C7 10.7761 7.22386 11 7.5 11H10.5C10.7761 11 11 10.7761 11 10.5C11 10.2239 10.7761 10 10.5 10H7.5Z" fill="#D97B00" />
    <path d="M5 8C5 7.72386 5.22386 7.5 5.5 7.5H6C6.27614 7.5 6.5 7.72386 6.5 8C6.5 8.27614 6.27614 8.5 6 8.5H5.5C5.22386 8.5 5 8.27614 5 8Z" fill="#D97B00" />
    <path d="M5.5 10C5.22386 10 5 10.2239 5 10.5C5 10.7761 5.22386 11 5.5 11H6C6.27614 11 6.5 10.7761 6.5 10.5C6.5 10.2239 6.27614 10 6 10H5.5Z" fill="#D97B00" />
    <path fillRule="evenodd" clipRule="evenodd" d="M4 1.5C2.61929 1.5 1.5 2.61929 1.5 4V12C1.5 13.3807 2.61929 14.5 4 14.5H12C13.3807 14.5 14.5 13.3807 14.5 12V4C14.5 2.61929 13.3807 1.5 12 1.5H4ZM2.5 4C2.5 3.17157 3.17157 2.5 4 2.5H12C12.8284 2.5 13.5 3.17157 13.5 4V12C13.5 12.8284 12.8284 13.5 12 13.5H4C3.17157 13.5 2.5 12.8284 2.5 12V4Z" fill="#D97B00" />
  </svg>
);

const IcGauge = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="14" viewBox="0 0 13 14" fill="none">
    <path d="M6.50476 4.20056C5.55564 4.17985 4.62169 4.44105 3.82101 4.95114C3.02034 5.46122 2.3889 6.19728 2.00656 7.06623C1.62421 7.93518 1.50812 8.898 1.67298 9.83293C1.71134 10.0505 1.56607 10.2579 1.34851 10.2963C1.13095 10.3347 0.92349 10.1894 0.885129 9.97185C0.6928 8.8811 0.828235 7.75781 1.27431 6.74403C1.72038 5.73026 2.45705 4.87152 3.39117 4.27642C4.32529 3.68132 5.4149 3.37659 6.52221 3.40075C7.62953 3.42491 8.70481 3.77688 9.61208 4.41216C9.79304 4.53887 9.83702 4.78829 9.71031 4.96925C9.5836 5.15022 9.33418 5.1942 9.15322 5.06748C8.37556 4.52296 7.45389 4.22127 6.50476 4.20056Z" fill="#F04F7B" />
    <path d="M10.43 5.68914C10.611 5.56243 10.8604 5.6064 10.9871 5.78737C11.4089 6.38977 11.7079 7.06936 11.8671 7.78734C12.0263 8.50531 12.0425 9.2476 11.9148 9.97183C11.8764 10.1894 11.6689 10.3347 11.4514 10.2963C11.2338 10.2579 11.0885 10.0505 11.1269 9.83291C11.2364 9.21214 11.2225 8.57589 11.0861 7.96049C10.9496 7.34508 10.6933 6.76258 10.3318 6.24623C10.2051 6.06527 10.249 5.81585 10.43 5.68914Z" fill="#F04F7B" />
    <path d="M9.08289 6.88226C9.2391 6.72605 9.2391 6.47278 9.08289 6.31657C8.92668 6.16036 8.67342 6.16036 8.51721 6.31657L6.11721 8.71657C5.961 8.87278 5.961 9.12605 6.11721 9.28226C6.27342 9.43847 6.52668 9.43847 6.68289 9.28226L9.08289 6.88226Z" fill="#F04F7B" />
  </svg>
);

const IcStatsPlatforms = () => (
  <svg width="32" height="33" viewBox="0 0 32 33" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18 10.7812C18 10.229 18.4477 9.78125 19 9.78125H22C22.5523 9.78125 23 10.229 23 10.7812C23 11.3335 22.5523 11.7812 22 11.7812H19C18.4477 11.7812 18 11.3335 18 10.7812Z" fill="#9184F5" />
    <path d="M10 21.7812C9.44772 21.7812 9 22.229 9 22.7812C9 23.3335 9.44772 23.7812 10 23.7812H22C22.5523 23.7812 23 23.3335 23 22.7812C23 22.229 22.5523 21.7812 22 21.7812H10Z" fill="#9184F5" />
    <path d="M18 16.7812C18 16.229 18.4477 15.7812 19 15.7812H22C22.5523 15.7812 23 16.229 23 16.7812C23 17.3335 22.5523 17.7812 22 17.7812H19C18.4477 17.7812 18 17.3335 18 16.7812Z" fill="#9184F5" />
    <path fillRule="evenodd" clipRule="evenodd" d="M10 9.78125C8.89543 9.78125 8 10.6767 8 11.7812V15.7812C8 16.8858 8.89543 17.7812 10 17.7812H14C15.1046 17.7812 16 16.8858 16 15.7812V11.7812C16 10.6767 15.1046 9.78125 14 9.78125H10ZM10 11.7812H14V15.7812H10V11.7812Z" fill="#9184F5" />
    <path fillRule="evenodd" clipRule="evenodd" d="M3 8.78125C3 6.01983 5.23858 3.78125 8 3.78125H24C26.7614 3.78125 29 6.01983 29 8.78125V24.7812C29 27.5427 26.7614 29.7812 24 29.7812H8C5.23858 29.7812 3 27.5427 3 24.7812V8.78125ZM8 5.78125C6.34315 5.78125 5 7.1244 5 8.78125V24.7812C5 26.4381 6.34315 27.7812 8 27.7812H24C25.6569 27.7812 27 26.4381 27 24.7812V8.78125C27 7.1244 25.6569 5.78125 24 5.78125H8Z" fill="#9184F5" />
  </svg>
);

const IcStatsMagic = () => (
  <svg width="32" height="33" viewBox="0 0 32 33" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20.1344 3.08113C20.0736 2.8733 19.883 2.73047 19.6665 2.73047C19.45 2.73047 19.2594 2.8733 19.1986 3.08113L18.1704 6.59689L14.6547 7.62507C14.4468 7.68585 14.304 7.87643 14.304 8.09297C14.304 8.3095 14.4468 8.50009 14.6547 8.56087L18.1704 9.58904L19.1986 13.1048C19.2594 13.3126 19.45 13.4555 19.6665 13.4555C19.883 13.4555 20.0736 13.3126 20.1344 13.1048L21.1626 9.58904L24.6783 8.56087C24.8862 8.50009 25.029 8.3095 25.029 8.09297C25.029 7.87643 24.8862 7.68585 24.6783 7.62507L21.1626 6.59689L20.1344 3.08113Z" fill="#00CFE5" />
    <path fillRule="evenodd" clipRule="evenodd" d="M2.80593 12.1113L19.5482 28.8535C20.6905 29.9958 22.5425 29.9958 23.6848 28.8535L24.8271 27.7113C25.9694 26.569 25.9694 24.717 24.8271 23.5747L8.08479 6.8324C6.94251 5.69012 5.0905 5.69012 3.94822 6.8324L2.80593 7.97469C1.66365 9.11697 1.66365 10.969 2.80593 12.1113ZM7.96654 14.5141L4.18479 10.7324C3.80403 10.3516 3.80403 9.7343 4.18479 9.35354L5.32707 8.21126C5.70783 7.8305 6.32517 7.8305 6.70593 8.21126L10.4877 11.993L7.96654 14.5141ZM9.3454 15.893L20.9271 27.4747C21.3078 27.8554 21.9252 27.8554 22.3059 27.4747L23.4482 26.3324C23.829 25.9516 23.829 25.3343 23.4482 24.9535L11.8665 13.3719L9.3454 15.893Z" fill="#00CFE5" />
    <path d="M25.9844 12.8311C25.9236 12.6233 25.733 12.4805 25.5165 12.4805C25.3 12.4805 25.1094 12.6233 25.0486 12.8311L24.4617 14.8381L22.4547 15.4251C22.2468 15.4858 22.104 15.6764 22.104 15.893C22.104 16.1095 22.2468 16.3001 22.4547 16.3609L24.4617 16.9478L25.0486 18.9548C25.1094 19.1626 25.3 19.3055 25.5165 19.3055C25.733 19.3055 25.9236 19.1626 25.9844 18.9548L26.5713 16.9478L28.5783 16.3609C28.7862 16.3001 28.929 16.1095 28.929 15.893C28.929 15.6764 28.7862 15.4858 28.5783 15.4251L26.5713 14.8381L25.9844 12.8311Z" fill="#00CFE5" />
    <path d="M6.67935 21.9961C6.61857 21.7883 6.42799 21.6455 6.21145 21.6455C5.99492 21.6455 5.80433 21.7883 5.74355 21.9961L5.15661 24.0031L3.14962 24.5901C2.94178 24.6508 2.79895 24.8414 2.79895 25.058C2.79895 25.2745 2.94178 25.4651 3.14962 25.5259L5.15661 26.1128L5.74355 28.1198C5.80433 28.3276 5.99492 28.4705 6.21145 28.4705C6.42799 28.4705 6.61857 28.3276 6.67935 28.1198L7.26629 26.1128L9.27329 25.5259C9.48112 25.4651 9.62395 25.2745 9.62395 25.058C9.62395 24.8414 9.48112 24.6508 9.27329 24.5901L7.26629 24.0031L6.67935 21.9961Z" fill="#00CFE5" />
  </svg>
);

const IcStatsArrow = () => (
  <svg width="32" height="33" viewBox="0 0 32 33" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" clipRule="evenodd" d="M19.2461 2.78667C19.7954 2.84365 20.1945 3.33516 20.1376 3.8845L19.0959 13.9265L26.1218 14.7888C26.5013 14.8353 26.8211 15.0942 26.9455 15.4557C27.07 15.8172 26.9775 16.2181 26.7071 16.4884L12.7071 30.4884C12.494 30.7016 12.2085 30.7984 11.9297 30.7789C11.8721 30.783 11.8134 30.7821 11.754 30.776C11.2047 30.719 10.8055 30.2275 10.8625 29.6782L11.9041 19.6361L4.87821 18.7739C4.49872 18.7273 4.17901 18.4684 4.05452 18.1069C3.93003 17.7454 4.02257 17.3446 4.29292 17.0742L18.2929 3.07422C18.5061 2.86105 18.7916 2.76424 19.0704 2.78379C19.128 2.77968 19.1867 2.78051 19.2461 2.78667ZM13.126 27.2411L23.843 16.5241L17.8782 15.7921C17.3373 15.7257 16.9491 15.2384 17.0054 14.6963L17.874 6.32153L7.15702 17.0385L13.1218 17.7706C13.6628 17.837 14.0509 18.3243 13.9947 18.8663L13.126 27.2411Z" fill="#FFB300" />
  </svg>
);

const IcPrivacyBadge = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80" fill="none">
    <g clipPath="url(#tdl_clip0_4865_23540)">
      <g filter="url(#tdl_filter0_d_4865_23540)">
        <path d="M22.8571 25.7143C22.8571 22.5584 25.4154 20 28.5713 20H51.4285C54.5844 20 57.1428 22.5584 57.1428 25.7143V54.2857C57.1428 57.4416 54.5844 60 51.4285 60H28.5713C25.4154 60 22.8571 57.4416 22.8571 54.2857V25.7143Z" fill="white" />
        <rect x="31.4286" y="28.5723" width="17.1429" height="1.42857" rx="0.714286" fill="#8F8F8F" />
        <rect x="31.4286" y="34.2852" width="17.1429" height="1.42857" rx="0.714286" fill="#8F8F8F" />
        <rect x="31.4286" y="40" width="17.1429" height="1.42857" rx="0.714286" fill="#8F8F8F" />
        <rect x="31.4286" y="45.7148" width="8.57143" height="1.42857" rx="0.714286" fill="#8F8F8F" />
        <path d="M45.7142 46.8723C45.7142 46.3785 46.0516 45.9487 46.5312 45.8315L52.6027 44.3473C52.7698 44.3065 52.9444 44.3065 53.1115 44.3473L59.1829 45.8315C59.6625 45.9487 59.9999 46.3785 59.9999 46.8723V51.1569C59.9999 54.4311 58.1347 57.4193 55.1932 58.8574L52.8571 59.9994L50.521 58.8574C47.5795 57.4193 45.7142 54.4311 45.7142 51.1569V46.8723Z" fill="#FFAA00" />
        <path d="M55.7143 50L52.8572 52.8571L51.4286 51.4286" stroke="white" strokeWidth="1.42857" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </g>
    <defs>
      <filter id="tdl_filter0_d_4865_23540" x="-12" y="-4" width="96" height="96" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
        <feOffset dx="-4" dy="4" />
        <feGaussianBlur stdDeviation="4" />
        <feColorMatrix type="matrix" values="0 0 0 0 0.85 0 0 0 0 0.497098 0 0 0 0 0 0 0 0 0.4 0" />
        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_4865_23540" />
        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_4865_23540" result="shape" />
      </filter>
      <clipPath id="tdl_clip0_4865_23540">
        <rect width="80" height="80" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

const IcSecurityBadge = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80" fill="none">
    <g clipPath="url(#tdl_clip0_4865_23516)">
      <g filter="url(#tdl_filter0_d_4865_23516)">
        <rect x="19.9996" y="22.8594" width="39.9963" height="34.2825" rx="5.71375" fill="white" />
        <path d="M19.9996 28.5731C19.9996 25.4175 22.5578 22.8594 25.7134 22.8594V57.1419C22.5578 57.1419 19.9996 54.5837 19.9996 51.4281V28.5731Z" fill="#F5F5F5" />
        <path d="M19.9996 28.5731C19.9996 25.4175 22.5578 22.8594 25.7134 22.8594H54.2821C57.4377 22.8594 59.9959 25.4175 59.9959 28.5731H19.9996Z" fill="#525252" />
        <rect x="37.1407" y="24.2871" width="7.14219" height="2.85687" rx="1.42844" fill="#CCCCCC" />
        <rect x="32.8555" y="24.2871" width="2.85687" height="2.85687" rx="1.42844" fill="#F04C54" />
        <rect x="21.428" y="30.002" width="2.85687" height="2.85687" rx="1.42844" fill="#ADADAD" />
        <rect x="21.428" y="34.2871" width="2.85687" height="2.85687" rx="1.42844" fill="#ADADAD" />
        <rect x="21.428" y="38.5723" width="2.85687" height="2.85687" rx="1.42844" fill="#ADADAD" />
        <rect x="21.428" y="42.8574" width="2.85687" height="2.85687" rx="1.42844" fill="#ADADAD" />
        <circle cx="41.4261" cy="42.8565" r="9.99906" fill="#FFB5C9" />
        <path d="M44.7595 37.6871L37.6738 42.0788L40.2233 43.5738L37.4784 48.3281L44.9949 43.6826L42.2222 42.0818L44.7595 37.6871Z" fill="white" />
      </g>
    </g>
    <defs>
      <filter id="tdl_filter0_d_4865_23516" x="-12" y="-3.99609" width="95.9957" height="95.9961" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
        <feOffset dx="-4" dy="4" />
        <feGaussianBlur stdDeviation="4" />
        <feColorMatrix type="matrix" values="0 0 0 0 0.941176 0 0 0 0 0.356863 0 0 0 0 0.513726 0 0 0 0.4 0" />
        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_4865_23516" />
        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_4865_23516" result="shape" />
      </filter>
      <clipPath id="tdl_clip0_4865_23516">
        <rect width="79.9957" height="79.9957" fill="white" transform="translate(0 0.00390625)" />
      </clipPath>
    </defs>
  </svg>
);

const IcReliabilityBadge = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80" fill="none">
    <g filter="url(#tdl_filter0_d_4865_23533)">
      <circle cx="39.9954" cy="40.002" r="20" fill="white" />
      <circle cx="39.9953" cy="40.0017" r="12.1429" fill="white" stroke="#9B9BFE" strokeWidth="1.42857" />
      <circle cx="39.9953" cy="40.0033" r="5" stroke="#9B9BFE" strokeWidth="1.42857" />
      <path d="M55.7096 24.2891L39.9953 40.0033" stroke="#FF668F" strokeWidth="1.42857" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M59.9954 24.2891L55.7096 24.2891L55.7096 20.0033" stroke="#FF668F" strokeWidth="1.42857" />
    </g>
    <defs>
      <filter id="tdl_filter0_d_4865_23533" x="-12.0043" y="-3.99805" width="96" height="96" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
        <feOffset dx="-4" dy="4" />
        <feGaussianBlur stdDeviation="4" />
        <feColorMatrix type="matrix" values="0 0 0 0 0.462745 0 0 0 0 0.4 0 0 0 0 0.94902 0 0 0 0.4 0" />
        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_4865_23533" />
        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_4865_23533" result="shape" />
      </filter>
    </defs>
  </svg>
);

const ArrowRight = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/* ------------------------------------------------------------------
   Data
   ------------------------------------------------------------------ */

const NAV_ITEMS: { label: string; href?: string }[] = [
  { label: "Products" },
  { label: "Solutions" },
  { label: "Impact Stories", href: "https://www.toddleapp.com/impact-stories/" },
  { label: "Learn" },
  { label: "Pricing", href: "https://www.toddleapp.com/pricing/" }
];

/* fold2 school logos: the spec line ends x14 - 14 logo tiles */
const SCHOOL_LOGO =
  "https://cdn.www.toddleapp.com/wp-content/uploads/2025/04/Logo-48.webp";
const SCHOOL_LOGOS = Array.from({ length: 14 }, () => SCHOOL_LOGO);

const SLIDER_TABS: { label: string; active?: boolean }[] = [
  { label: "Curriculum Planning", active: true },
  { label: "Assessments & Gradebook" },
  { label: "AI Tutors" },
  { label: "Student Portfolios" },
  { label: "Progress Reports & Transcripts" },
  { label: "Communications Hub" },
  { label: "Attendance, Timetable & Calendar" },
  { label: "Pastoral Care" },
  { label: "Accreditation Management" }
];

type Slide = {
  title: string;
  desc: string;
  bullets: { text: string; icon: React.ReactNode }[];
  href: string;
  img: string;
  shadow: string;
};

const SLIDES: Slide[] = [
  {
    title: "Curriculum Planning",
    desc: "Design, map, and publish your curriculum with the guidance of AI at every step",
    bullets: [
      { text: "Plan end-to-end, maps, courses, lessons", icon: <IcPlan /> },
      { text: "Plan end-to-end, maps, courses, lessons", icon: <IcPlan /> },
      { text: "Plan end-to-end, maps, courses, lessons", icon: <IcPlan /> },
      { text: "Plan end-to-end, maps, courses, lessons", icon: <IcPlan /> }
    ],
    href: "https://www.toddleapp.com/product/curriculum-planning/",
    img: "https://cdn.www.toddleapp.com/wp-content/uploads/2025/10/Curriculum-Planning-2.webp",
    shadow: "tdl-shadow-orange"
  },
  {
    title: "Assessments & Gradebook",
    desc: "Design assessments, give rich feedback, and track progress - all powered by AI",
    bullets: [
      { text: "Assess your way - standards or scores based", icon: <IcGauge /> },
      { text: "Assess your way - standards or scores based", icon: <IcGauge /> },
      { text: "Assess your way - standards or scores based", icon: <IcGauge /> },
      { text: "Assess your way - standards or scores based", icon: <IcGauge /> }
    ],
    href: "https://www.toddleapp.com/product/assessments-gradebook/",
    img: "https://cdn.www.toddleapp.com/wp-content/uploads/2025/06/Assessments-Gradebook.webp",
    shadow: "tdl-shadow-pink"
  },
  {
    title: "Pastoral Care",
    desc: "Track behaviour. Support well-being. Strengthen school culture",
    bullets: [
      { text: "Flexible system that adapts to school’s approach", icon: <IcSmile /> },
      { text: "Write nuanced reports in seconds with AI", icon: <IcReport /> },
      { text: "Surface trends in school culture & well-being", icon: <IcHeart /> }
    ],
    href: "https://www.toddleapp.com/product/behavior-management/",
    img: "https://cdn.www.toddleapp.com/wp-content/uploads/2025/06/Dashboard-1-2.webp",
    shadow: "tdl-shadow-pink"
  },
  {
    title: "Accreditation Management",
    desc: "Stay accreditation-ready - always, effortlessly, and in one place",
    bullets: [
      { text: "Evidence, reviews, and feedback in one place", icon: <IcTarget /> },
      { text: "Visual dashboard for real-time collaboration", icon: <IcPresentation /> },
      {
        text: "Built-in standards for 15+ accrediting bodies, including IB and NEASC",
        icon: <IcShieldPlus />
      }
    ],
    href: "https://www.toddleapp.com/product/accreditation-management/",
    img: "https://cdn.www.toddleapp.com/wp-content/uploads/2025/06/Accreditation-Management.webp",
    shadow: "tdl-shadow-purple"
  }
];

const AI_TABS: { title: string; desc: string; active?: boolean }[] = [
  {
    title: "Curriculum Design Assistant",
    desc: "Built to elevate every stage of curriculum design - from courses to units to lessons",
    active: true
  },
  {
    title: "Assignment Builder",
    desc: "Give Toddle AI broad strokes and generate worksheets, questions, assessment tools & more in seconds"
  },
  {
    title: "Assignment Builder",
    desc: "Give Toddle AI broad strokes and generate worksheets, questions, assessment tools & more in seconds"
  },
  {
    title: "Assignment Builder",
    desc: "Give Toddle AI broad strokes and generate worksheets, questions, assessment tools & more in seconds"
  },
  {
    title: "Assignment Builder",
    desc: "Give Toddle AI broad strokes and generate worksheets, questions, assessment tools & more in seconds"
  },
  {
    title: "Assignment Builder",
    desc: "Give Toddle AI broad strokes and generate worksheets, questions, assessment tools & more in seconds"
  }
];

/* Integration logo rows: each row is a x6 group of the captured logo */
const INTEGRATION_ROWS: { src: string; alt: string }[] = [
  { src: "https://cdn.www.toddleapp.com/wp-content/uploads/2024/08/Frame-2610461.webp", alt: "Isams logo" },
  { src: "https://cdn.www.toddleapp.com/wp-content/uploads/2024/09/Frame-2610454-2.webp", alt: "Clever logo" }
];

const PRIVACY_LOGOS: { src: string; alt: string; href?: string; padded?: boolean }[] = [
  { src: "https://cdn.www.toddleapp.com/wp-content/uploads/2026/05/ISTE-seal-1.webp", alt: "ISTE Logo" },
  {
    src: "https://cdn.www.toddleapp.com/wp-content/uploads/2025/07/TrustEd-Privacy.webp",
    alt: "1EdTech logo",
    href: "https://site.imsglobal.org/certifications/toddle/toddle",
    padded: true
  },
  { src: "https://cdn.www.toddleapp.com/wp-content/uploads/2025/12/essa-1.webp", alt: "Digital Promise logo" },
  { src: "https://cdn.www.toddleapp.com/wp-content/uploads/2025/12/rdai.webp", alt: "Digital Promise" },
  { src: "https://cdn.www.toddleapp.com/wp-content/uploads/2025/01/COPPA.webp", alt: "COPPA logo", href: "https://www.toddleapp.com/coppa/" },
  { src: "https://cdn.www.toddleapp.com/wp-content/uploads/2025/01/FERPA.webp", alt: "FERPA logo", href: "https://www.toddleapp.com/ferpa/" },
  { src: "https://cdn.www.toddleapp.com/wp-content/uploads/2025/01/AICPA.webp", alt: "AICPA logo" },
  { src: "https://cdn.www.toddleapp.com/wp-content/uploads/2025/11/ISO-42001-2.webp", alt: "ISO 42001" },
  { src: "https://cdn.www.toddleapp.com/wp-content/uploads/2025/11/ISO-27001-2.webp", alt: "ISO 27001" },
  { src: "https://cdn.www.toddleapp.com/wp-content/uploads/2025/01/CCPA.webp", alt: "CCPA logo", href: "https://www.toddleapp.com/ccpa/" }
];

const FOOTER_FEATURES: { label: string; href: string }[] = [
  { label: "Overview", href: "https://www.toddleapp.com/product/product-overview/" },
  { label: "Curriculum Planning", href: "https://www.toddleapp.com/product/curriculum-planning/" },
  { label: "Assessments & Gradebook", href: "https://www.toddleapp.com/product/assessments-gradebook/" },
  { label: "Student Portfolios", href: "https://www.toddleapp.com/product/student-portfolios/" },
  { label: "Progress Reports & Transcripts", href: "https://www.toddleapp.com/product/progress-reports-transcripts/" },
  { label: "Class Operations", href: "https://www.toddleapp.com/product/class-operations/" },
  { label: "Communications Hub", href: "https://www.toddleapp.com/product/communications-hub/" },
  { label: "Accreditation Management", href: "https://www.toddleapp.com/product/accreditation-management/" },
  { label: "Pastoral Care", href: "https://www.toddleapp.com/product/behavior-management/" },
  { label: "Toddle AI", href: "https://www.toddleapp.com/ai/" },
  { label: "Integrations", href: "https://www.toddleapp.com/integrations/" },
  { label: "AI Insights", href: "https://www.toddleapp.com/ai-insights/" }
];

const FOOTER_SOLUTIONS: { label: string; href: string }[] = [
  { label: "Public Schools & Districts", href: "https://www.toddleapp.com/us-districts-solutions/" },
  { label: "Independent schools", href: "https://www.toddleapp.com/independent-schools/" },
  { label: "Understanding by Design", href: "https://www.toddleapp.com/ubd/" },
  { label: "IB PYP", href: "https://www.toddleapp.com/ib-pyp/" },
  { label: "IB MYP", href: "https://www.toddleapp.com/ib-myp/" },
  { label: "IB DP", href: "https://www.toddleapp.com/ib-dp/" },
  { label: "IB CP", href: "https://www.toddleapp.com/product/ib-cp/" },
  { label: "IB Candidate", href: "https://www.toddleapp.com/ib-candidate-schools/" },
  { label: "Bespoke", href: "https://www.toddleapp.com/custom-solution/" }
];

const FOOTER_COMPANY: { label: string; href: string }[] = [
  { label: "Pricing", href: "https://www.toddleapp.com/pricing/" },
  { label: "Careers", href: "https://careers.toddleapp.com/" },
  { label: "FAQs", href: "https://www.toddleapp.com/faqs/" },
  { label: "Privacy and Security Hub", href: "https://www.toddleapp.com/privacy-center/" },
  { label: "Quality EdTech Certifications", href: "https://www.toddleapp.com/quality-edtech-certifications/" },
  { label: "Privacy Policy", href: "https://www.toddleapp.com/privacy-policy/" },
  { label: "Cookie Policy", href: "https://www.toddleapp.com/cookie-policy/" },
  { label: "Terms of Service", href: "https://www.toddleapp.com/termsofservice/" },
  { label: "Terms of Use", href: "https://www.toddleapp.com/termsofuse/" },
  { label: "Responsible Vulnerability Disclosure", href: "https://www.toddleapp.com/responsible-vulnerability-disclosure-policy/" },
  { label: "Contact us", href: "https://www.toddleapp.com/contact-us/" },
  { label: "Toddle’s Advisory Board 2026", href: "https://www.toddleapp.com/toddle-global-advisory-council-2026/" },
  { label: "Sustainability", href: "https://www.toddleapp.com/sustainability/" }
];

const FOOTER_EVENTS: { label: string; href: string }[] = [
  { label: "Toddle Demo Day, Edition 1", href: "https://www.toddleapp.com/events/demo-day-jan2024/" },
  { label: "Toddle Demo Day, Edition 2", href: "https://www.toddleapp.com/events/demo-day-may2024/" },
  { label: "Toddle Demo Day, Edition 3", href: "https://www.toddleapp.com/toddle-demo-day-december-2024/" },
  { label: "Toddle Demo Day, Edition 4", href: "https://www.toddleapp.com/toddle-demo-day-march-2025/" },
  { label: "Toddle Demo Day, Edition 5", href: "https://www.toddleapp.com/toddle-demo-day-november-2025/" },
  { label: "Toddle Demo Day, Edition 6", href: "https://www.toddleapp.com/toddle-demo-day-february-2026/" },
  { label: "Toddle Demo Day, Edition 7", href: "https://www.toddleapp.com/toddle-demo-day-april-2026/" },
  { label: "How Schools AI 2026", href: "https://www.toddleapp.com/events/how-schools-ai/" },
  { label: "ChatGPT Crash Course for Educators (Part 1)", href: "https://www.toddleapp.com/learn/talk-post/chatgpt-crash-course-for-educators/" },
  { label: "Leading with AI", href: "https://www.toddleapp.com/events/leading-with-ai/" }
];

const FOOTER_RESOURCES: { label: string; href: string }[] = [
  { label: "School Leaders Project", href: "https://slp.toddleapp.com/" },
  { label: "School’s vision for AI", href: "https://www.toddleapp.com/learn/blog-post/future-of-ai-in-education/" },
  { label: "99 thinking tools for every inquiry classroom", href: "https://www.toddleapp.com/learn/resource-post/thinking-tools-for-every-inquiry-math-ela-science-and-more/" },
  { label: "Mastering GPT for lesson planning", href: "https://www.toddleapp.com/learn/blog-post/mastering-chatgpt-lesson-planning/" },
  { label: "Building rubrics for authentic assessments", href: "https://www.toddleapp.com/learn/resource-post/building-rubrics-for-efficient-and-authentic-assessment/" }
];

/* ------------------------------------------------------------------
   Component
   ------------------------------------------------------------------ */

export default function ComponentMockupToddle(): JSX.Element {
  return (
    <div className="tdl-root">
      {/* ============ 00 HEADER ============ */}
      <header className="tdl-header">
        <div className="tdl-header-container">
          <nav className="tdl-navbar">
            <a className="tdl-logo-link" href="https://www.toddleapp.com">
              <img
                className="tdl-logo"
                src="https://cdn.www.toddleapp.com/wp-content/uploads/2024/07/Toddle_black_logo.svg"
                alt="Toddle"
              />
            </a>
            <div className="tdl-navbar-collapse">
              <ul className="tdl-navbar-nav">
                {NAV_ITEMS.map((item) => (
                  <li className="tdl-nav-item" key={item.label}>
                    <a href={item.href || "#"}>{item.label}</a>
                  </li>
                ))}
              </ul>
            </div>
            <div className="tdl-buttons-main">
              <a
                className="tdl-signin"
                href="https://web.toddleapp.com/?utm_source=website&type=loginHome"
              >
                Sign in
              </a>
              <a className="tdl-req-demo" href="https://www.toddleapp.com/book-a-free-demo/">
                Get a demo
              </a>
            </div>
          </nav>
        </div>
      </header>

      {/* ============ 01 HERO / TEACHER-BUILT ============ */}
      <div className="tdl-home-banner-wrapper">
        <div className="tdl-home-content-wrapper">
          <h1 className="tdl-home-banner-title">
            Teacher-built. More than an LMS.
            <br />
            <span className="tdl-hover-text">AI-powered.</span>
          </h1>
          <p className="tdl-home-banner-content">
            Plan, teach, assess, report, and communicate, all in one place. Powered by the most
            advanced AI for education, so you can work faster, teach better, and personalise
            learning like never before.
          </p>
          <a className="tdl-hero-demo" href="/book-a-free-demo/">
            Get a demo
          </a>
        </div>

        <img
          className="tdl-ipad-hero-banner"
          src="https://cdn.www.toddleapp.com/wp-content/uploads/2024/10/Group-27726-1.webp"
          alt="multiple screenshots represents plan curriculum, assess learning, and create rep"
        />

        <div className="tdl-home-grid-wrapper">
          <div className="tdl-grid-item3">
            <img
              src="https://cdn.www.toddleapp.com/wp-content/uploads/2024/10/Tier-2-White-side-Navigation-1.webp"
              alt="Navigation interface"
            />
          </div>
          <div className="tdl-grid-item5">
            <img
              src="https://cdn.www.toddleapp.com/wp-content/uploads/2024/10/Frame-2609364-2-1.webp"
              alt="Toddle educators community"
            />
          </div>
          <div className="tdl-grid-item10">
            <img
              src="https://cdn.www.toddleapp.com/wp-content/uploads/2024/10/Connect-1-1.webp"
              alt="Connection or integration feature"
            />
          </div>
          <div className="tdl-grid-item14">
            <img
              src="https://cdn.www.toddleapp.com/wp-content/uploads/2024/10/2.0-DS-Analytics-Nav-1.webp"
              alt="Toddle analytics dashboard"
            />
          </div>
          <div className="tdl-grid-item15">
            <img
              src="https://cdn.www.toddleapp.com/wp-content/uploads/2024/10/EducatorMobilepost-1-1.webp"
              alt="Educator using Toddle on mobile device"
            />
          </div>
        </div>

        <div className="tdl-fold2-wrapper">
          <div className="tdl-fold2-content-container">
            <h2 className="tdl-fold-title">
              2,500+ leading schools &amp; districts around the world run on Toddle
            </h2>
          </div>
          <div className="tdl-school-logo-container">
            {SCHOOL_LOGOS.map((src, i) => (
              <img key={i} src={src} alt="Tonbridge Grammar School" />
            ))}
          </div>
        </div>
      </div>

      {/* ============ 02 OPEN LETTER ============ */}
      <section className="tdl-open-letter-wrapper">
        <div className="tdl-open-letter-left">
          <h2 className="tdl-open-letter-title">An open letter from our founder</h2>
          <p className="tdl-open-letter-subject">
            <b>Putting students first starts with putting our teachers first.</b>
          </p>
          <p className="tdl-open-letter-subject">
            At Toddle, our big hairy audacious goal is to give each teacher 10 additional hours every
            week while helping you elevate your practices. We&rsquo;re doing three things to achieve
            this goal:
          </p>
          <ul className="tdl-open-letter-pointers">
            <li>Building Toddle as your all-in-one teaching &amp; learning hub</li>
            <li>Embedding a super powerful AI assistant directly into your workflow</li>
            <li>Integrating Toddle with all your favourite tools for a seamless experience</li>
          </ul>
          <p className="tdl-open-letter-subject">
            We&rsquo;re dedicated to building technology that brings joy to teachers every day.
          </p>
          <img
            className="tdl-sign-img"
            src="https://cdn.www.toddleapp.com/wp-content/uploads/2024/10/Deepanshus-signature.webp"
            alt="Founder signature"
          />
          <div className="tdl-below-signature">
            <div className="tdl-founder-name">Deepanshu Arora</div>
            <p className="tdl-founder-designation">School Leader, CEO at Toddle</p>
          </div>
        </div>
        <div className="tdl-open-letter-right">
          <img
            className="tdl-open-letter-right-img"
            src="https://cdn.www.toddleapp.com/wp-content/uploads/2024/09/IMG_0028.webp"
            alt="open letter"
          />
        </div>
      </section>

      {/* ============ 03 PRODUCT SLIDER ============ */}
      <section className="tdl-product-slider-section">
        <div className="tdl-slider-container">
          <div className="tdl-sliders-info">
            <div className="tdl-top-product-slider">
              <h2>One platform for all your teaching &amp; learning workflows</h2>
            </div>
            <div className="tdl-product-slides">
              <div className="tdl-content">
                <div className="tdl-slider-nav-container">
                  <div className="tdl-slider-nav">
                    {SLIDER_TABS.map((tab) => (
                      <div
                        key={tab.label}
                        className={
                          "tdl-slide-top-btn" + (tab.active ? " tdl-active" : "")
                        }
                      >
                        {tab.label}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="tdl-slider">
                  <div className="tdl-slick-list">
                    <div className="tdl-slick-track">
                      {SLIDES.map((slide) => (
                        <div className="tdl-slick-slide" key={slide.title}>
                          <div className="tdl-slide-info">
                            <span>{slide.title}</span>
                            <p>{slide.desc}</p>
                            <ul>
                              {slide.bullets.map((b, i) => (
                                <li key={i}>
                                  <span>{b.icon}</span>
                                  {b.text}
                                </li>
                              ))}
                            </ul>
                            <a className="tdl-learn-more" href={slide.href}>
                              Learn More
                            </a>
                          </div>
                          <img
                            className={"tdl-slide-img " + slide.shadow}
                            src={slide.img}
                            alt={slide.title}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="tdl-slider-navigation">
                  <div className="tdl-progress-click-area">
                    <div className="tdl-progress-container">
                      <div className="tdl-progress-bar" />
                    </div>
                  </div>
                  <div className="tdl-nav-buttons">
                    <button
                      type="button"
                      className="tdl-slick-arrow tdl-disabled"
                      aria-label="Previous"
                    >
                      &#8249;
                    </button>
                    <button type="button" className="tdl-slick-arrow" aria-label="Next">
                      &#8250;
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ 04 STATS ============ */}
      <section className="tdl-stats-wrapper">
        <div className="tdl-stats-inner-wrapper">
          <div className="tdl-stats-content-wrapper">
            <div className="tdl-stats-percent">85%</div>
            <p>schools replace 3 or more technology platforms when they bring in Toddle.</p>
          </div>
          <div className="tdl-stats-icon-wrapper">
            <IcStatsPlatforms />
          </div>
        </div>
        <div className="tdl-stats-inner-wrapper">
          <div className="tdl-stats-content-wrapper">
            <div className="tdl-stats-percent">95%</div>
            <p>teachers say they save 2 to 5 hours every week with Toddle AI.</p>
          </div>
          <div className="tdl-stats-icon-wrapper">
            <IcStatsMagic />
          </div>
        </div>
        <div className="tdl-stats-inner-wrapper">
          <div className="tdl-stats-content-wrapper">
            <div className="tdl-stats-percent">97%</div>
            <p>
              teachers say Toddle helps them understand and personalise student learning better.
            </p>
          </div>
          <div className="tdl-stats-icon-wrapper">
            <IcStatsArrow />
          </div>
        </div>
      </section>

      {/* ============ 05 AI SUITE TABS ============ */}
      <section className="tdl-ai-tabs-section">
        <div>
          <h2>World&rsquo;s most powerful AI suite for K-12 schools</h2>
          <div className="tdl-ai-subtitle">
            <p>Save up to 10 hours every week. Streamline your work, amplify your impact.</p>
          </div>
          <div className="tdl-tabs-container">
            <div className="tdl-tabbings">
              <div className="tdl-tabs">
                {AI_TABS.map((tab, i) => (
                  <div
                    key={i}
                    className={"tdl-tab-a-content" + (tab.active ? " tdl-active" : "")}
                  >
                    <div className="tdl-tab-title">{tab.title}</div>
                    <p className="tdl-tab-description">{tab.desc}</p>
                  </div>
                ))}
              </div>
              <div className="tdl-cta">
                <a className="tdl-exploreai-btn" href="/ai/">
                  Explore Toddle AI
                </a>
              </div>
            </div>
            <div className="tdl-products-img-sec">
              <div className="tdl-image-container">
                <img
                  src="https://cdn.www.toddleapp.com/wp-content/uploads/2025/06/Curriculum-Design-Assistant-1.webp"
                  alt="Save time and elevate your practices with personal AI assistant"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ 06 INTEGRATIONS ============ */}
      <div className="tdl-fold5-wrapper" id="integrate-tools">
        <h2 className="tdl-fold5-title">Integrate with all your favourite tools</h2>
        <p className="tdl-fold5-content">
          We&rsquo;re building the most integrated school technology ecosystem so you can work in a
          state of flow. 50+ integrations &amp; counting.
        </p>
        {INTEGRATION_ROWS.map((row, r) => (
          <div className="tdl-fold5-tools-wrapper" key={r}>
            {Array.from({ length: 6 }, (_, i) => (
              <div className="tdl-integrated-tool" key={i}>
                <img src={row.src} alt={row.alt} />
              </div>
            ))}
          </div>
        ))}
        <a className="tdl-explore-btn" href="https://www.toddleapp.com/integrations">
          Explore Integrations
        </a>
      </div>

      {/* ============ 07 IMPACT STORIES ============ */}
      <div className="tdl-multipletab" id="testimonials">
        <h2 className="tdl-testimonial-main-title">Impact stories from our users worldwide</h2>
        <div className="tdl-tab-content">
          <div className="tdl-single-testimonial">
            <div className="tdl-single-testimonial-img">
              <img
                src="https://embed-ssl.wistia.com/deliveries/c7f80bd8d357d4e8bbc39b57db3c8e31.webp?image_crop_resized=1088x800"
                alt="Wistia video thumbnail"
              />
            </div>
            <div className="tdl-single-testimonial-txt">
              <div className="tdl-single-testimonial-desc">
                &ldquo;Working with{" "}
                <strong>
                  Toddle AI is like having the support of a really experienced educator right next to
                  you
                </strong>
                , throughout your day.&rdquo;
              </div>
              <div className="tdl-single-testimonial-author">Jenna Fritz</div>
              <div className="tdl-single-testimonial-desig">
                Landmark International School, England
              </div>
              <div className="tdl-blue-tag">Toddle AI</div>
            </div>
          </div>
          <div className="tdl-tab-nav">
            <span className="tdl-prev-testi">&#8249;</span>
            <span className="tdl-next-testi">&#8250;</span>
          </div>
        </div>
        <div className="tdl-tab-buttons">
          <span className="tdl-active">Landmark International School</span>
          <span>International School of Prague</span>
          <span>Children&rsquo;s International School</span>
          <span>Creation Village</span>
        </div>
        <div className="tdl-btn-wrapper">
          <a className="tdl-explore-stories-btn" href="#">
            Explore Impact Stories
          </a>
        </div>
      </div>

      {/* ============ 08 COMMUNITY ============ */}
      <div className="tdl-community-collab-wrapper">
        <h3 className="tdl-community-collab-title">A community of collaboration</h3>
        <p className="tdl-community-collab-sub-content">
          Toddle is more than just a tech platform, it&rsquo;s where a community of 200,000+
          educators learn and grow together. Our thoughtfully-curated PD events and resources empower
          teachers and school leaders at all stages of their careers to elevate their craft.
        </p>
        <div className="tdl-community-collab-cardlist">
          <div className="tdl-community-collab-card">
            <a href="https://slp.toddleapp.com/">
              <img
                className="tdl-community-collab-card-img"
                src="https://cdn.www.toddleapp.com/wp-content/uploads/2024/10/School-leaders-Project.webp"
                alt="School Leaders Project"
              />
              <div className="tdl-community-collab-card-inner">
                <p className="tdl-community-collab-card-innerp">School Leaders Project</p>
                <p className="tdl-community-collab-content">
                  Tune into this podcast to learn how school leaders can create lasting change, build
                  mission-driven teams, and navigate complex challenges.
                </p>
                <p className="tdl-community-collab-card-innera">
                  <span>Listen now</span>
                  <img
                    src="https://cdn.www.toddleapp.com/wp-content/uploads/2022/04/Union-1.png"
                    alt="Button arrow"
                  />
                </p>
              </div>
            </a>
          </div>
          <div className="tdl-community-collab-card">
            <a href="https://www.toddleapp.com/events/ties/">
              <img
                className="tdl-community-collab-card-img"
                src="https://cdn.www.toddleapp.com/wp-content/uploads/2024/09/cc-2.webp"
                alt="Toddle TIES 2024"
              />
              <div className="tdl-community-collab-card-inner">
                <p className="tdl-community-collab-card-innerp">Toddle TIES 2024</p>
                <p className="tdl-community-collab-content">
                  Elevate your teaching with cutting-edge, never-heard-before strategies at the
                  world&rsquo;s largest gathering of inquiry educators.
                </p>
                <p className="tdl-community-collab-card-innera">
                  <span>Watch recordings</span>
                  <img
                    src="https://cdn.www.toddleapp.com/wp-content/uploads/2022/04/Union-1.png"
                    alt="Button arrow"
                  />
                </p>
              </div>
            </a>
          </div>
          <div className="tdl-community-collab-card">
            <a href="https://www.toddleapp.com/learn/blog-post/ai-tools-school-leadership/">
              <img
                className="tdl-community-collab-card-img"
                src="https://cdn.www.toddleapp.com/wp-content/uploads/2024/09/cc-6.webp"
                alt="AI Tools for School Leadership"
              />
              <div className="tdl-community-collab-card-inner">
                <p className="tdl-community-collab-card-innerp">AI Tools for School Leadership</p>
                <p className="tdl-community-collab-content">
                  Explore a comprehensive guide to help you navigate the 3 most crucial aspects of
                  leading AI implementation across your school.
                </p>
                <p className="tdl-community-collab-card-innera">
                  <span>Learn more</span>
                  <img
                    src="https://cdn.www.toddleapp.com/wp-content/uploads/2022/04/Union-1.png"
                    alt="Button arrow"
                  />
                </p>
              </div>
            </a>
          </div>
        </div>
        <a className="tdl-explore-resource-btn" href="https://www.toddleapp.com/learn/">
          Explore Toddle Learn
        </a>
      </div>

      {/* ============ 09 PRIVATE. SECURE. RELIABLE. ============ */}
      <section className="tdl-sustain-journey-main-wrapper">
        <div className="tdl-sustain-journey-title-wrapper">
          <h2 className="tdl-sustain-journey-title">Private. Secure. Reliable.</h2>
          <p className="tdl-sustain-journey-desc">
            Protect your school&rsquo;s most sensitive data with industry-leading safeguards and
            uncompromising privacy standards, creating a safe, stable environment for teaching and
            learning.
          </p>
        </div>

        <div className="tdl-sustain-journey-cards-main-wrapper">
          <div className="tdl-sustain-journey-single-card tdl-card-privacy">
            <div className="tdl-sustain-journey-single-card-content">
              <div className="tdl-sustain-journey-single-card-title">Privacy</div>
              <p>
                Stay in control with transparent data practices and flexible permissions. Toddle
                complies with COPPA, GDPR, SOC 2, FERPA, and all major state privacy regulations.
              </p>
            </div>
            <div className="tdl-sustain-journey-single-card-icon">
              <IcPrivacyBadge />
            </div>
          </div>
          <div className="tdl-sustain-journey-single-card tdl-card-security">
            <div className="tdl-sustain-journey-single-card-content">
              <div className="tdl-sustain-journey-single-card-title">Security</div>
              <p>
                Your data is encrypted in transit and at rest, continuously monitored for threats,
                and protected by enterprise-grade security protocols.
              </p>
            </div>
            <div className="tdl-sustain-journey-single-card-icon">
              <IcSecurityBadge />
            </div>
          </div>
          <div className="tdl-sustain-journey-single-card tdl-card-reliability">
            <div className="tdl-sustain-journey-single-card-content">
              <div className="tdl-sustain-journey-single-card-title">Reliability</div>
              <p>
                Count on 99.9% uptime, real-time backups, and fast, responsive support, so your
                school day never skips a beat.
              </p>
            </div>
            <div className="tdl-sustain-journey-single-card-icon">
              <IcReliabilityBadge />
            </div>
          </div>
        </div>

        <div className="tdl-foldus-logo-wrapper">
          {PRIVACY_LOGOS.map((logo, i) => {
            const inner = (
              <div className={logo.padded ? "tdl-privacy-logo-padded" : "tdl-privacy-logo"}>
                <img src={logo.src} alt={logo.alt} />
              </div>
            );
            return logo.href ? (
              <a key={i} href={logo.href}>
                {inner}
              </a>
            ) : (
              <React.Fragment key={i}>{inner}</React.Fragment>
            );
          })}
        </div>

        <div className="tdl-sustain-journey-bottom-text-wrapper">
          <a className="tdl-sustain-afforest-bottom-btn" href="/privacy-center/">
            Explore Privacy &amp; Security Hub
          </a>
        </div>
      </section>

      {/* ============ 10 SUSTAINABILITY ============ */}
      <div className="tdl-sustainability-slider-main-wrapper">
        <div className="tdl-sustain-afforest-slider-wrapper">
          <div className="tdl-sustain-afforest-slider-title-wrapper">
            <h2 className="tdl-sustain-afforest-slider-title">Our commitment to sustainability</h2>
            <p className="tdl-sustain-afforest-slider-desc">
              Toddle is proud to be <b>carbon neutral</b> as of April 2025. We&rsquo;ve carefully
              measured our emissions for CY24, cut emissions with best-in-class practices in
              engineering, remote work, and team travel, and offset the rest with trusted credits.
            </p>
          </div>
          <div className="tdl-sustain-afforest-img-slider-wrapper">
            <div className="tdl-sustain-afforest-img-slider">
              <div className="tdl-sustain-afforest-single-slider-img">
                <img
                  src="https://cdn.www.toddleapp.com/wp-content/uploads/2025/06/Frame-1000003594-3.webp"
                  alt="Afforestation in India by IFFDC"
                />
              </div>
            </div>
            <div className="tdl-sustain-afforest-slider-nav-btns">
              <span className="tdl-sustain-afforest-prev-slide-btn">&#8249;</span>
              <span className="tdl-sustain-afforest-next-slide-btn">&#8250;</span>
            </div>
          </div>
          <div className="tdl-sustain-afforest-slider-bottom-content-wrapper">
            <div className="tdl-sustain-afforest-slider-bottom-content-right">
              <a className="tdl-sustain-afforest-bottom-btn" href="/sustainability/">
                Explore Sustainability at Toddle
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ============ 11 CTA ============ */}
      <div className="tdl-cta-wrapper">
        <img
          className="tdl-cta-gradient-left"
          src="https://cdn.www.toddleapp.com/wp-content/uploads/2024/10/Ellipse-6667-5-1.webp"
          alt=""
        />
        <div className="tdl-cta-inner-wrapper">
          <div className="tdl-cta-content-wrapper">
            <h3>Ready to see Toddle in action?</h3>
            <p className="tdl-cta-content-desk">
              Schedule a product demo with a fellow educator.
            </p>
            <a className="tdl-cta-demo-btn" href="/book-a-free-demo/">
              Get a demo
            </a>
          </div>
          <div className="tdl-cta-image-wrapper">
            <img
              src="https://cdn.www.toddleapp.com/wp-content/uploads/2024/10/Homepage-_-Others-1.webp"
              alt="Screenshot of product demo"
            />
          </div>
        </div>
        <img
          className="tdl-cta-gradient-right"
          src="https://cdn.www.toddleapp.com/wp-content/uploads/2024/10/Ellipse-6666-7-1.webp"
          alt=""
        />
      </div>

      {/* ============ 12 FOOTER ============ */}
      <div className="tdl-main-footer">
        <div className="tdl-footer-col">
          <div className="tdl-footer-secd">
            <h3>Features</h3>
            <div className="tdl-menu-container">
              <ul>
                {FOOTER_FEATURES.map((item) => (
                  <li key={item.label}>
                    <a href={item.href}>{item.label}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <p className="tdl-copyrights">&copy; Teacher Tools Pvt. Ltd.</p>
        </div>

        <div className="tdl-footer-col">
          <h3>Solutions</h3>
          <div className="tdl-menu-container">
            <ul>
              {FOOTER_SOLUTIONS.map((item) => (
                <li key={item.label}>
                  <a href={item.href}>{item.label}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="tdl-footer-col">
          <h3>Company</h3>
          <div className="tdl-menu-container">
            <ul>
              {FOOTER_COMPANY.map((item) => (
                <li key={item.label}>
                  <a href={item.href}>{item.label}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="tdl-footer-col">
          <h3>Events &amp; Webinars</h3>
          <div className="tdl-menu-container">
            <ul>
              {FOOTER_EVENTS.map((item) => (
                <li key={item.label}>
                  <a href={item.href}>{item.label}</a>
                </li>
              ))}
            </ul>
          </div>
          <h3>Resources</h3>
          <div className="tdl-menu-container">
            <ul>
              {FOOTER_RESOURCES.map((item) => (
                <li key={item.label}>
                  <a href={item.href}>{item.label}</a>
                </li>
              ))}
            </ul>
          </div>
          <h3>Connect with us</h3>
          <ul className="tdl-social-list">
            {[
              "https://www.facebook.com/toddle.edu/",
              "https://www.facebook.com/toddle.edu/",
              "https://www.facebook.com/toddle.edu/",
              "https://www.facebook.com/toddle.edu/",
              "https://www.facebook.com/toddle.edu/"
            ].map((href, i) => (
              <li key={i}>
                <a href={href} aria-label="Toddle social link">
                  <ArrowRight />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
