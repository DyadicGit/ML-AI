# Playground for Machine Learning and AI - Convolutional Neural Networks (CNN)

### solve browser error: _Initialization of backend webgl failed_
> goto [chrome://flags/](chrome://flags/) search "**Override software rendering list**" > set enabled > restart browser
> 
> P.S. here you can check graphics features [chrome://gpu/](chrome://gpu/)

### Turn ON Hardware Acceleration - greatly speeds up FPS
> 1. Launch Chrome, then select “Menu”  > “Settings“.
> 2. Scroll down to the bottom and select the “Advanced” option.
> 3. Scroll to the “System” section and toggle “Use hardware acceleration when available” on or off as desired.

Option 2 – Via Registry (Windows)
> 1. Hold down the Windows Key and press “R” to bring up the Run window.
> 2. Type “regedit“, then press “Enter” to bring up the Registry Editor.
> 3. Navigate to:
> HKEY_LOCAL_MACHINE \ SOFTWARE \ Policies \ Google \ Chrome \
> 4. Right-click “Chrome” and select “New” > “DWORD 32-bit value“
> 5. Give the value a name of “HardwareAccelerationModeEnabled“.
> 6. Set the value data to “0” to disable Hardware Acceleration. Set it to “1” to enable it.

Option 3 – Terminal Command (MacOS)
> 1. Close Chrome.
> 2. From the Finder, select “Go” > “Utilities“.
> 3. Launch “Terminal“.
> 4. Type the following command, then press “Enter“:
> defaults write com.google.chrome HardwareAccelerationModeEnabled -integer n
> Where n is 1 or 0. 1 will enable Hardware Acceleration. 0 will disabled it.
