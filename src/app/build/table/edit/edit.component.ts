import { Component, Inject, Input, OnInit } from "@angular/core";
import { EruptModel } from "../../../erupt/model/erupt.model";
import { DataService } from "../../../erupt/service/data.service";
import { TabEnum } from "../../../erupt/model/erupt.enum";
import { SettingsService } from "@delon/theme";
import { EruptAndEruptFieldModel } from "../../../erupt/model/erupt-page.model";
import { NzFormatEmitEvent, NzMessageService, NzModalService } from "ng-zorro-antd";
import { DataHandlerService } from "../../../erupt/service/data-handler.service";
import { EditTypeComponent } from "../../../erupt/edit-type/edit-type.component";
import { colRules } from "../../../erupt/model/util.model";
import { STComponent } from "@delon/abc";

@Component({
  selector: "erupt-edit",
  templateUrl: "./edit.component.html",
  styleUrls: ["./edit.component.less"]
})
export class EditComponent implements OnInit {

  private rowData: any;

  private tabEnum = TabEnum;

  private stConfig = {
    stPage: {
      placement: "center",
      pageSizes: [10, 30, 50, 100],
      showSize: true,
      showQuickJumper: true,
      total: true,
      toTop: true,
      front: true
    }
  };

  @Input() eruptModel: EruptModel;

  @Input() subErupts: Array<EruptAndEruptFieldModel>;

  @Input() behavior: "add" | "edit" | "readonly" = "add";

  @Input() set rowDataFun(data: any) {
    if (data) {
      this.rowData = data;
      this.dataHandlerService.objectToEruptValue(this.eruptModel, data);
    } else {
      this.dataHandlerService.objectToEruptValue(this.eruptModel, {});
    }
    /**
     * TAB control
     */
    // 读取tab栏的数据
    if (this.rowData) {
      this.subErupts && this.subErupts.forEach(sub => {
        const tabType = sub.eruptFieldModel.eruptFieldJson.edit.tabType[0];
        switch (tabType.type) {
          case TabEnum.TREE:
            this.dataService.findTabTreeById(this.eruptModel.eruptName, this.rowData[this.eruptModel.eruptJson.primaryKeyCol], sub.eruptFieldModel.fieldName).subscribe(
              tree => {
                console.log(sub.eruptFieldModel.eruptFieldJson.edit.$viewValue);
                console.log(sub.eruptFieldModel.eruptFieldJson.edit.$value);
                sub.eruptFieldModel.eruptFieldJson.edit.$value = tree;
              }
            );
            break;
          case TabEnum.TABLE:
            this.dataService.findTabListById(this.eruptModel.eruptName, this.rowData[this.eruptModel.eruptJson.primaryKeyCol], sub.eruptFieldModel.fieldName).subscribe(
              data => {
                sub.eruptFieldModel.eruptFieldJson.edit.$value = data;
              }
            );
            break;
        }
      });
    }
  }

  constructor(private dataService: DataService,
              private settingSrv: SettingsService,
              private dataHandlerService: DataHandlerService,
              @Inject(NzMessageService) private msg: NzMessageService,
              @Inject(NzModalService) private modal: NzModalService) {

  }

  ngOnInit() {
    this.subErupts && this.subErupts.forEach(sub => {
      const tabType = sub.eruptFieldModel.eruptFieldJson.edit.tabType[0];
      switch (tabType.type) {
        case TabEnum.TREE:

          break;
        case TabEnum.TABLE:
          if (this.behavior == "readonly") {
            sub.eruptFieldModel.eruptFieldJson.edit.$viewValue = sub.alainTableConfig;
          } else {
            const viewValue = sub.eruptFieldModel.eruptFieldJson.edit.$viewValue = [];
            viewValue.push({
              title: "",
              type: "checkbox",
              fixed: "left",
              className: "text-center",
              index: this.eruptModel.eruptJson.primaryKeyCol
            });
            viewValue.push(...sub.alainTableConfig);
            viewValue.push({
              title: "操作区",
              fixed: "right",
              width: "150px",
              className: "text-center",
              buttons: [
                {
                  icon: "edit",
                  click: (record: any, modal: any, comp: STComponent) => {
                    this.modal.create({
                      nzWrapClassName: "modal-md",
                      nzStyle: { top: "20px" },
                      nzMaskClosable: false,
                      nzKeyboard: false,
                      nzTitle: "编辑",
                      nzContent: EditTypeComponent,
                      nzComponentParams: {
                        eruptModel: sub.eruptModel,
                        col: colRules[2]
                      },
                      nzOnOk: () => {
                        let obj = this.dataHandlerService.eruptValueToObject(sub.eruptModel);
                        console.log(obj);
                        console.log(comp.data);
                      }
                    });
                  }
                },
                {
                  icon: {
                    type: "delete",
                    theme: "twotone",
                    twoToneColor: "#f00"
                  },
                  type: "del",
                  click: (record, modal, comp: STComponent) => {
                    comp.removeRow(record);
                  }
                }
              ]
            });
          }
          break;
      }
    });
  }

  deleteData(sub: EruptAndEruptFieldModel) {
    const tempValue = sub.eruptFieldModel.eruptFieldJson.edit.$tempValue;
    if (tempValue && tempValue.length > 0) {
      console.log(sub.eruptFieldModel.eruptFieldJson.edit.$value);
      const val = sub.eruptFieldModel.eruptFieldJson.edit.$value;

    } else {
      this.msg.warning("请选中要删除的数据");
    }
  }

  addData(sub: EruptAndEruptFieldModel) {
    this.modal.create({
      nzWrapClassName: "modal-md",
      nzStyle: { top: "50px" },
      nzMaskClosable: false,
      nzKeyboard: false,
      nzTitle: "编辑",
      nzContent: EditTypeComponent,
      nzComponentParams: {
        eruptModel: sub.eruptModel
      },
      nzOnOk: () => {
        let obj = this.dataHandlerService.eruptValueToObject(sub.eruptModel);
        sub.eruptFieldModel.eruptFieldJson.edit.$value.push(obj);
        console.log(sub.eruptFieldModel.eruptFieldJson.edit.$value);
      }
    });
  }

  selectTableItem(event, sub: EruptAndEruptFieldModel) {
    if (event.type === "checkbox") {
      sub.eruptFieldModel.eruptFieldJson.edit.$tempValue = event.checkbox;
    }
  }


  nzEvent(event: NzFormatEmitEvent): void {

  }

}
