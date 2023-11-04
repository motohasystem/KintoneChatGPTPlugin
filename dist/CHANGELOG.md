
# Change log
## [2.0.1] - 2023-09-02
### Fixed
- 「レコードの一括削除」ダイアログ下部のボタンが半分沈む現象を回避(bootstrap対策)

## [2.0.0] - 2023-08-06
### Changed
- プラグイン名称を「ChatGPT連携プラグイン」から「ChattyTone」に変更

### Added
- 出力フィールドの候補として「文字列（一行）」フィールドを追加
- function callingを利用したスピーチエディットモードを追加

## [1.1.1] - 2023-07-26
### Fixed
- 呼び出しボタンラベルのデフォルトを定義

## [1.1.0] - 2023-07-25
### Changed
- Added a one-line text field as a candidate output field.

### Added
- Added setting to allow specifying the label of the call button.
- Added temperature parameter setting.
- Added top_p parameter setting.

## [1.0.2] - 2023-06-23
### Fixed
- Catch errors that occur when changing field codes after setting up the plugin

## [1.0.1] - 2023-06-09

### Fixed
- Fixed errors that occur when embedding functionality is not used
- Avoided database lock errors that occurred at certain times

## [1.0] - 2023-06-07
### Changed
- Organize items and comments on the settings screen

### Removed
- Removed the ability to edit records directly

## [0.5] - 2023-05-18
### Added
- Added import/export buttons

## [0.4] - 2023-05-12
### Changed
- Changed API call from Complete to Chat
- The model default was changed to gpt-3.5-turbo accordingly.

## [0.3] - 2023-04-20
### Changed
- Use setProxyConfig() API to store authentication information
### Added
- Added an item to specify the ChatGPT model on the plugin settings screen.

## [0.2] - 2023-03-27
### Added
- Added individual prompt settings

## [0.1] - 2023-03-24
- first release

### Added
### Changed
### Deprecated
### Removed
### Fixed
### Security
