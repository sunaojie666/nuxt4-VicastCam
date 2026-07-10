export const sdkCameraDocs = {
  // Source: sdk说明文档222_函数指针版.xlsx, Sheet1.
  loadvicastcamdll: {
    path: `loadvicastcamdll (C/C++)
PreVicastCam.LoadVicastCamDll (C#)`,
    params: `tmpDllPath：vicastcam.dll 路径，wchar_t* / string。支持绝对路径或相对调用方 EXE 目录路径，不能为空。`,
    codeSamples: `C:
#include <windows.h>
#include \u0022pre_vicastcam_c.h\u0022
int ret = loadvicastcamdll(L\u0022vicastcam.dll\u0022);
if (ret != ERROR_SUCCESS) { DWORD err = GetLastError(); }

C++:
#include <windows.h>
#include \u0022pre_vicastcam_cplusplus.h\u0022
int ret = loadvicastcamdll(L\u0022vicastcam.dll\u0022);
if (ret != ERROR_SUCCESS) { DWORD err = GetLastError(); }

C#:
// Add pre_vicastcam_csharp.cs to the project
int ret = PreVicastCam.LoadVicastCamDll(@\u0022vicastcam.dll\u0022);
if (ret != 0) { int err = Marshal.GetLastWin32Error(); }`,
    returns: `ERROR_SUCCESS（0）：加载成功
ERROR_FILE_NOT_FOUND（2）：tmpDllPath 指向的 DLL 文件不存在
ERROR_BAD_FORMAT（11）：传入文件不是 .dll，或格式不正确
ERROR_INVALID_PARAMETER（87）：tmpDllPath 为空或参数非法
ERROR_MOD_NOT_FOUND（126）：LoadLibrary 失败，vicastcam.dll 或其依赖模块缺失
ERROR_PROC_NOT_FOUND（127）：DLL 缺少必要导出函数，如 DllInstall、DllRegisterServer、InitVcam、getImageToCamera 等
ERROR_BAD_PATHNAME（161）：路径非法或相对路径解析失败
ERROR_ALREADY_EXISTS（183）：当前进程已经加载另一条路径下的 vicastcam.dll，不允许混用
ERROR_BAD_EXE_FORMAT（193）：DLL 位数不匹配或不是有效 win32 DLL
ERROR_ELEVATION_REQUIRED（740）：虚拟相机未安装，且当前环境需要管理员权限才能完成系统级注册
ERROR_INSTALL_FAILURE（1603）：已尝试注册/安装，但注册后仍未检测到虚拟相机
ERROR_ACCESS_DENIED（5）：注册表写入或组件访问被拒绝`,
  },
  g_vicastcam_InitVcam: {
    path: `g_vicastcam_InitVcam (C/C++)
PreVicastCam.g_vicastcam_InitVcam (C#)`,
    params: `无参数。调用前必须先成功执行 loadvicastcamdll。`,
    codeSamples: `C:
#include <windows.h>
#include \u0022pre_vicastcam_c.h\u0022
int ret = loadvicastcamdll(L\u0022vicastcam.dll\u0022);
if (ret == ERROR_SUCCESS) {
    int r = g_vicastcam_InitVcam();
    if (r != ERROR_SUCCESS) { DWORD err = GetLastError(); }
}

C++:
#include <windows.h>
#include \u0022pre_vicastcam_cplusplus.h\u0022
int ret = loadvicastcamdll(L\u0022vicastcam.dll\u0022);
if (ret == ERROR_SUCCESS) {
    int r = g_vicastcam_InitVcam();
    if (r != ERROR_SUCCESS) { DWORD err = GetLastError(); }
}

C#:
// Add pre_vicastcam_csharp.cs to the project
int ret = PreVicastCam.LoadVicastCamDll(@\u0022vicastcam.dll\u0022);
if (ret == 0) {
    int r = PreVicastCam.g_vicastcam_InitVcam();
    if (r != 0) { int err = Marshal.GetLastWin32Error(); }
}`,
    returns: `ERROR_SUCCESS（0）：初始化成功
ERROR_OPEN_FAILED（110）：新帧事件创建/打开失败`,
  },
  g_vicastcam_SetOutputFormat: {
    path: `g_vicastcam_SetOutputFormat (C/C++)
PreVicastCam.g_vicastcam_SetOutputFormat (C#)`,
    params: `width：输出宽度，必须 > 0，内部会规范为偶数，最大 4096。
height：输出高度，必须 > 0，内部会规范为偶数，最大 4096。
format：输出格式偏好，0 = YUY2，非 0 = NV12；`,
    codeSamples: `C:
#include <windows.h>
#include \u0022pre_vicastcam_c.h\u0022
int ret = loadvicastcamdll(L\u0022vicastcam.dll\u0022);
if (ret == ERROR_SUCCESS) {
    int r = g_vicastcam_SetOutputFormat(1280, 720, 1); // 1 = NV12
}

C++:
#include <windows.h>
#include \u0022pre_vicastcam_cplusplus.h\u0022
int ret = loadvicastcamdll(L\u0022vicastcam.dll\u0022);
if (ret == ERROR_SUCCESS) {
    int r = g_vicastcam_SetOutputFormat(1280, 720, 0); // 0 = YUY2
}

C#:
// Add pre_vicastcam_csharp.cs to the project
int ret = PreVicastCam.LoadVicastCamDll(@\u0022vicastcam.dll\u0022);
if (ret == 0) {
    int r = PreVicastCam.g_vicastcam_SetOutputFormat(1280, 720, 1);
}`,
    returns: `ERROR_SUCCESS（0）：设置成功
ERROR_INVALID_PARAMETER（87）：宽高非法、超过上限或偶数规范后无效
ERROR_OPEN_FAILED（110）：新帧事件创建/打开失败`,
  },
  g_vicastcam_SendFrameYUY2: {
    path: `g_vicastcam_SendFrameYUY2 (C/C++)
PreVicastCam.g_vicastcam_SendFrameYUY2 (C#)`,
    params: `i_yuy2：YUY2 原始帧数据指针。
i_width：输入帧宽度，建议为偶数。
i_height：输入帧高度，建议为偶数。
i_stride：每行字节数，通常为 i_width * 2。`,
    codeSamples: `C:
#include <windows.h>
#include \u0022pre_vicastcam_c.h\u0022
int ret = loadvicastcamdll(L\u0022vicastcam.dll\u0022);
if (ret == ERROR_SUCCESS) {
    unsigned char* yuy2 = frameData;
    int r = g_vicastcam_SendFrameYUY2(yuy2, 1280, 720, 1280 * 2);
}

C++:
#include <windows.h>
#include \u0022pre_vicastcam_cplusplus.h\u0022
int ret = loadvicastcamdll(L\u0022vicastcam.dll\u0022);
if (ret == ERROR_SUCCESS) {
    std::vector<unsigned char> yuy2(1280 * 720 * 2);
    int r = g_vicastcam_SendFrameYUY2(yuy2.data(), 1280, 720, 1280 * 2);
}

C#:
// Add pre_vicastcam_csharp.cs to the project
int ret = PreVicastCam.LoadVicastCamDll(@\u0022vicastcam.dll\u0022);
if (ret == 0) {
    IntPtr framePtr = /* YUY2 frame buffer */ IntPtr.Zero;
    int r = PreVicastCam.g_vicastcam_SendFrameYUY2(framePtr, 1280, 720, 1280 * 2);
}`,
    returns: `ERROR_SUCCESS（0）：发送成功
ERROR_INVALID_PARAMETER（87）：数据指针为空或宽高非法
ERROR_OPEN_FAILED（110）：共享资源打开失败
ERROR_INVALID_DATA（13）：帧格式、尺寸或 stride 不合法
ERROR_WRITE_FAULT（29）：写入失败`,
  },
  g_vicastcam_SendFrameNV12: {
    path: `g_vicastcam_SendFrameNV12 (C/C++)
PreVicastCam.g_vicastcam_SendFrameNV12 (C#)`,
    params: `i_nv12：NV12 原始帧数据指针，Y 平面后接交错 UV 平面。
i_width：输入帧宽度，必须为偶数。
i_height：输入帧高度，必须为偶数。
i_stride：Y/UV 每行字节数，通常为 i_width。`,
    codeSamples: `C:
#include <windows.h>
#include \u0022pre_vicastcam_c.h\u0022
int ret = loadvicastcamdll(L\u0022vicastcam.dll\u0022);
if (ret == ERROR_SUCCESS) {
    unsigned char* nv12 = frameData;
    int r = g_vicastcam_SendFrameNV12(nv12, 1280, 720, 1280);
}

C++:
#include <windows.h>
#include \u0022pre_vicastcam_cplusplus.h\u0022
int ret = loadvicastcamdll(L\u0022vicastcam.dll\u0022);
if (ret == ERROR_SUCCESS) {
    std::vector<unsigned char> nv12(1280 * 720 * 3 / 2);
    int r = g_vicastcam_SendFrameNV12(nv12.data(), 1280, 720, 1280);
}

C#:
// Add pre_vicastcam_csharp.cs to the project
int ret = PreVicastCam.LoadVicastCamDll(@\u0022vicastcam.dll\u0022);
if (ret == 0) {
    IntPtr framePtr = /* NV12 frame buffer */ IntPtr.Zero;
    int r = PreVicastCam.g_vicastcam_SendFrameNV12(framePtr, 1280, 720, 1280);
}`,
    returns: `ERROR_SUCCESS（0）：发送成功
ERROR_INVALID_PARAMETER（87）：数据指针为空或宽高非法
ERROR_OPEN_FAILED（110）：共享资源打开失败
ERROR_INVALID_DATA（13）：帧格式、尺寸或 stride 不合法
ERROR_WRITE_FAULT（29）：写入失败`,
  },
  g_vicastcam_getMultiMediaToCamera: {
    path: `g_vicastcam_getMultiMediaToCamera (C/C++)
PreVicastCam.g_vicastcam_getMultiMediaToCamera (C#)`,
    params: `tmpPath：多媒体文件路径，wchar_t* / string。支持绝对路径或相对调用方 EXE 目录路径。支持格式由当前 FFmpeg 构建决定，常见 mp4/avi/mkv/mov 等。函数会解码视频送虚拟相机，音频送默认扬声器，并按媒体时间轴同步播放，通常为阻塞式调用，建议放入工作线程。`,
    codeSamples: `C:
#include <windows.h>
#include \u0022pre_vicastcam_c.h\u0022
int ret = loadvicastcamdll(L\u0022vicastcam.dll\u0022);
if (ret == ERROR_SUCCESS) {
    int r = g_vicastcam_getMultiMediaToCamera(L\u0022media\\test.mp4\u0022);
}

C++:
#include <windows.h>
#include \u0022pre_vicastcam_cplusplus.h\u0022
int ret = loadvicastcamdll(L\u0022vicastcam.dll\u0022);
if (ret == ERROR_SUCCESS) {
    int r = g_vicastcam_getMultiMediaToCamera(L\u0022media\\test.mp4\u0022);
}

C#:
// Add pre_vicastcam_csharp.cs to the project
int ret = PreVicastCam.LoadVicastCamDll(@\u0022vicastcam.dll\u0022);
if (ret == 0) {
    int r = PreVicastCam.g_vicastcam_getMultiMediaToCamera(@\u0022media\\test.mp4\u0022);
}`,
    returns: `ERROR_SUCCESS（0）：播放完成或推送成功
ERROR_INVALID_PARAMETER（87）：路径参数为空
ERROR_FILE_NOT_FOUND（2）：文件不存在
ERROR_UNSUPPORTED_TYPE（1630）：没有可用视频流或解码器不支持
ERROR_INVALID_DATA（13）：媒体文件损坏、解码失败或数据不合法`,
  },
  g_vicastcam_getImageToCamera: {
    path: `g_vicastcam_getImageToCamera (C/C++)
PreVicastCam.g_vicastcam_getImageToCamera (C#)`,
    params: `tmpPath：图片文件路径，wchar_t* / string。支持绝对路径或相对调用方 EXE 目录路径。支持格式由当前 FFmpeg 构建决定，常见 png/jpg/jpeg/bmp/webp/gif 等；静态图发送一帧，动态图按时间戳推送。`,
    codeSamples: `C:
#include <windows.h>
#include \u0022pre_vicastcam_c.h\u0022
int ret = loadvicastcamdll(L\u0022vicastcam.dll\u0022);
if (ret == ERROR_SUCCESS) {
    int r = g_vicastcam_getImageToCamera(L\u0022images\\test.png\u0022);
}

C++:
#include <windows.h>
#include \u0022pre_vicastcam_cplusplus.h\u0022
int ret = loadvicastcamdll(L\u0022vicastcam.dll\u0022);
if (ret == ERROR_SUCCESS) {
    int r = g_vicastcam_getImageToCamera(L\u0022images\\test.png\u0022);
}

C#:
// Add pre_vicastcam_csharp.cs to the project
int ret = PreVicastCam.LoadVicastCamDll(@\u0022vicastcam.dll\u0022);
if (ret == 0) {
    int r = PreVicastCam.g_vicastcam_getImageToCamera(@\u0022images\\test.png\u0022);
}`,
    returns: `ERROR_SUCCESS（0）：图片推送成功
ERROR_INVALID_PARAMETER（87）：路径参数为空
ERROR_FILE_NOT_FOUND（2）：文件不存在
ERROR_UNSUPPORTED_TYPE（1630）：没有可用图像/视频流或解码器不支持
ERROR_INVALID_DATA（13）：图片损坏、解码失败或尺寸不合法`,
  },
  g_vicastcam_SetFriendlyName: {
    path: `g_vicastcam_SetFriendlyName (C/C++)
PreVicastCam.g_vicastcam_SetFriendlyName (C#)`,
    params: `friendly_name：虚拟相机显示名称，wchar_t* / string。支持多语言 Unicode 名称；内部会去除非法注册表/设备名字符并限制长度。`,
    codeSamples: `C:
#include <windows.h>
#include \u0022pre_vicastcam_c.h\u0022
int ret = loadvicastcamdll(L\u0022vicastcam.dll\u0022);
if (ret == ERROR_SUCCESS) {
    int r = g_vicastcam_SetFriendlyName(L\u0022كاميرا VicastCam\u0022); // Arabic
}

C++:
#include <windows.h>
#include \u0022pre_vicastcam_cplusplus.h\u0022
int ret = loadvicastcamdll(L\u0022vicastcam.dll\u0022);
if (ret == ERROR_SUCCESS) {
    int r = g_vicastcam_SetFriendlyName(L\u0022VicastCam Camera\u0022); // English
}

C#:
// Add pre_vicastcam_csharp.cs to the project
int ret = PreVicastCam.LoadVicastCamDll(@\u0022vicastcam.dll\u0022);
if (ret == 0) {
    int r = PreVicastCam.g_vicastcam_SetFriendlyName(\u0022VicastCam相机\u0022); // Chinese
}`,
    returns: `ERROR_SUCCESS（0）：设置并写入成功
ERROR_INVALID_PARAMETER（87）：名称为空或清理后为空
ERROR_ACCESS_DENIED（5）：写入用户配置或注册表权限不足
ERROR_NOT_READY（21）：相机尚未注册或对应注册表项不可用`,
  },
  g_vicastcam_SetLicenseCode: {
    path: `g_vicastcam_SetLicenseCode (C/C++)
PreVicastCam.g_vicastcam_SetLicenseCode (C#)`,
    params: `license_code：授权码字符串，char* / ANSI string。当前示例校验码为 ASCII 字符串；未调用或校验失败时，画面会显示居中 “vicastcam” 水印。`,
    codeSamples: `C:
#include <windows.h>
#include \u0022pre_vicastcam_c.h\u0022
int ret = loadvicastcamdll(L\u0022vicastcam.dll\u0022);
if (ret == ERROR_SUCCESS) {
    int r = g_vicastcam_SetLicenseCode(\u0022VICASTCAM-SDK-LICENSE-2026\u0022);
}

C++:
#include <windows.h>
#include \u0022pre_vicastcam_cplusplus.h\u0022
int ret = loadvicastcamdll(L\u0022vicastcam.dll\u0022);
if (ret == ERROR_SUCCESS) {
    int r = g_vicastcam_SetLicenseCode(\u0022VICASTCAM-SDK-LICENSE-2026\u0022);
}

C#:
// Add pre_vicastcam_csharp.cs to the project
int ret = PreVicastCam.LoadVicastCamDll(@\u0022vicastcam.dll\u0022);
if (ret == 0) {
    int r = PreVicastCam.g_vicastcam_SetLicenseCode(\u0022VICASTCAM-SDK-LICENSE-2026\u0022);
}`,
    returns: `ERROR_SUCCESS（0）：授权校验成功，去除水印
ERROR_ACCESS_DENIED（5）：授权码为空、错误或校验失败
ERROR_OPEN_FAILED（110）：共享资源创建/打开失败`,
  },
  g_vicastcam_setVcamOn: {
    path: `g_vicastcam_setVcamOn (C/C++)
PreVicastCam.g_vicastcam_setVcamOn (C#)`,
    params: `isOn：相机输出开关，int。0 = false，始终显示占位图；非 0 = true，优先显示真实输入帧。`,
    codeSamples: `C:
#include <windows.h>
#include \u0022pre_vicastcam_c.h\u0022
int ret = loadvicastcamdll(L\u0022vicastcam.dll\u0022);
if (ret == ERROR_SUCCESS) {
    g_vicastcam_setVcamOn(1); // Turn On Real Scene
    DWORD err = GetLastError();
}

C++:
#include <windows.h>
#include \u0022pre_vicastcam_cplusplus.h\u0022
int ret = loadvicastcamdll(L\u0022vicastcam.dll\u0022);
if (ret == ERROR_SUCCESS) {
    g_vicastcam_setVcamOn(0); // Show Placeholder Image
    DWORD err = GetLastError();
}

C#:
// Add pre_vicastcam_csharp.cs to the project
int ret = PreVicastCam.LoadVicastCamDll(@\u0022vicastcam.dll\u0022);
if (ret == 0) {
    PreVicastCam.g_vicastcam_setVcamOn(1);
    int err = Marshal.GetLastWin32Error();
}`,
    returns: `无返回值；调用后通过 GetLastError() 判断。
ERROR_SUCCESS（0）：设置成功
ERROR_OPEN_FAILED（110）：共享资源打开失败
ERROR_WRITE_FAULT（29）：写入控制状态失败`,
  },
  g_vicastcam_SetMirrorEnabled: {
    path: `g_vicastcam_SetMirrorEnabled (C/C++)
PreVicastCam.g_vicastcam_SetMirrorEnabled (C#)`,
    params: `enabled：左右镜像开关，int。0 = false，关闭镜像；非 0 = true，开启左右镜像。`,
    codeSamples: `C:
#include <windows.h>
#include \u0022pre_vicastcam_c.h\u0022
int ret = loadvicastcamdll(L\u0022vicastcam.dll\u0022);
if (ret == ERROR_SUCCESS) {
    g_vicastcam_SetMirrorEnabled(1);
    DWORD err = GetLastError();
}

C++:
#include <windows.h>
#include \u0022pre_vicastcam_cplusplus.h\u0022
int ret = loadvicastcamdll(L\u0022vicastcam.dll\u0022);
if (ret == ERROR_SUCCESS) {
    g_vicastcam_SetMirrorEnabled(0);
    DWORD err = GetLastError();
}

C#:
// Add pre_vicastcam_csharp.cs to the project
int ret = PreVicastCam.LoadVicastCamDll(@\u0022vicastcam.dll\u0022);
if (ret == 0) {
    PreVicastCam.g_vicastcam_SetMirrorEnabled(1);
    int err = Marshal.GetLastWin32Error();
}`,
    returns: `无返回值；调用后通过 GetLastError() 判断。
ERROR_SUCCESS（0）：设置成功
ERROR_OPEN_FAILED（110）：共享资源打开失败
ERROR_WRITE_FAULT（29）：写入控制状态失败`,
  },
  g_vicastcam_SetFlipEnabled: {
    path: `g_vicastcam_SetFlipEnabled (C/C++)
PreVicastCam.g_vicastcam_SetFlipEnabled (C#)`,
    params: `enabled：上下翻转开关，int。0 = false，关闭上下翻转；非 0 = true，开启上下翻转。`,
    codeSamples: `C:
#include <windows.h>
#include \u0022pre_vicastcam_c.h\u0022
int ret = loadvicastcamdll(L\u0022vicastcam.dll\u0022);
if (ret == ERROR_SUCCESS) {
    g_vicastcam_SetFlipEnabled(1);
    DWORD err = GetLastError();
}

C++:
#include <windows.h>
#include \u0022pre_vicastcam_cplusplus.h\u0022
int ret = loadvicastcamdll(L\u0022vicastcam.dll\u0022);
if (ret == ERROR_SUCCESS) {
    g_vicastcam_SetFlipEnabled(0);
    DWORD err = GetLastError();
}

C#:
// Add pre_vicastcam_csharp.cs to the project
int ret = PreVicastCam.LoadVicastCamDll(@\u0022vicastcam.dll\u0022);
if (ret == 0) {
    PreVicastCam.g_vicastcam_SetFlipEnabled(1);
    int err = Marshal.GetLastWin32Error();
}`,
    returns: `无返回值；调用后通过 GetLastError() 判断。
ERROR_SUCCESS（0）：设置成功
ERROR_OPEN_FAILED（110）：共享资源打开失败
ERROR_WRITE_FAULT（29）：写入控制状态失败`,
  },
  g_vicastcam_SetRotateRightDegree: {
    path: `g_vicastcam_SetRotateRightDegree (C/C++)
PreVicastCam.g_vicastcam_SetRotateRightDegree (C#)`,
    params: `degree：顺时针旋转幅度。0 = +90°，1 = +180°，2 = +270°。调用效果会累积。`,
    codeSamples: `C:
#include <windows.h>
#include \u0022pre_vicastcam_c.h\u0022
int ret = loadvicastcamdll(L\u0022vicastcam.dll\u0022);
if (ret == ERROR_SUCCESS) {
    g_vicastcam_SetRotateRightDegree(0); // Rotate 90° Clockwise
    DWORD err = GetLastError();
}

C++:
#include <windows.h>
#include \u0022pre_vicastcam_cplusplus.h\u0022
int ret = loadvicastcamdll(L\u0022vicastcam.dll\u0022);
if (ret == ERROR_SUCCESS) {
    g_vicastcam_SetRotateRightDegree(1); // Rotate 180° Clockwise
    DWORD err = GetLastError();
}

C#:
// Add pre_vicastcam_csharp.cs to the project
int ret = PreVicastCam.LoadVicastCamDll(@\u0022vicastcam.dll\u0022);
if (ret == 0) {
    PreVicastCam.g_vicastcam_SetRotateRightDegree(0);
    int err = Marshal.GetLastWin32Error();
}`,
    returns: `无返回值；调用后通过 GetLastError() 判断。
ERROR_SUCCESS（0）：设置成功
ERROR_INVALID_PARAMETER（87）：degree 不是 0/1/2
ERROR_OPEN_FAILED（110）：共享资源打开失败
ERROR_WRITE_FAULT（29）：写入控制状态失败`,
  },
  g_vicastcam_SetVacantImg: {
    path: `g_vicastcam_SetVacantImg (C/C++)
PreVicastCam.g_vicastcam_SetVacantImg (C#)`,
    params: `imgPath：BMP 占位图路径，wchar_t* / string。支持绝对路径或相对调用方 EXE 目录路径；仅支持 BMP；设置成功后按当前用户持久化保存。`,
    codeSamples: `C:
#include <windows.h>
#include \u0022pre_vicastcam_c.h\u0022
int ret = loadvicastcamdll(L\u0022vicastcam.dll\u0022);
if (ret == ERROR_SUCCESS) {
    int r = g_vicastcam_SetVacantImg(L\u0022images\\placeholder.bmp\u0022);
}

C++:
#include <windows.h>
#include \u0022pre_vicastcam_cplusplus.h\u0022
int ret = loadvicastcamdll(L\u0022vicastcam.dll\u0022);
if (ret == ERROR_SUCCESS) {
    int r = g_vicastcam_SetVacantImg(L\u0022images\\placeholder.bmp\u0022);
}

C#:
// Add pre_vicastcam_csharp.cs to the project
int ret = PreVicastCam.LoadVicastCamDll(@\u0022vicastcam.dll\u0022);
if (ret == 0) {
    int r = PreVicastCam.g_vicastcam_SetVacantImg(@\u0022images\\placeholder.bmp\u0022);
}`,
    returns: `ERROR_SUCCESS（0）：占位图设置成功
ERROR_INVALID_PARAMETER（87）：路径参数为空
ERROR_FILE_NOT_FOUND（2）：BMP 文件不存在
ERROR_INVALID_DATA（13）：文件不是有效 BMP 或图像格式/尺寸不合法
ERROR_ACCESS_DENIED（5）：保存占位图路径到用户配置失败`,
  },
}
