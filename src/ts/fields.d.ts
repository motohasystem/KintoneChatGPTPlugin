declare namespace kintone.types {
  interface Fields {
    $id: kintone.fieldTypes.Id;
    // date_register: kintone.fieldTypes.Date;
    // 住所: kintone.fieldTypes.SingleLineText;
    // 氏名漢字: kintone.fieldTypes.SingleLineText;
    // 電話番号: kintone.fieldTypes.SingleLineText;
    // 会員種別: kintone.fieldTypes.RadioButton;
  }
  interface SavedFields extends Fields {
    $id: kintone.fieldTypes.Id;
    $revision: kintone.fieldTypes.Revision;
    更新者: kintone.fieldTypes.Modifier;
    作成者: kintone.fieldTypes.Creator;
    レコード番号: kintone.fieldTypes.RecordNumber;
    更新日時: kintone.fieldTypes.UpdatedTime;
    作成日時: kintone.fieldTypes.CreatedTime;
  }
}
