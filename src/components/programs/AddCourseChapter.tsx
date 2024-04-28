import { Button, Drawer, Form, FormInstance, Input, Select, Space, message } from "antd";
import { FC, useState } from "react";
import styles from "@/styles/ProgramCourse.module.scss";
import { useRouter } from "next/router";

const AddCourseChapter: FC<{
  showChapterDrawer: (value: boolean) => void;
  updateChapter: (chapterId: number) => void;
  createChapter: (courseId: number) => void;
  loading: boolean | undefined;
  open: boolean;
  courseId: number;
  currentSeqIds: number[];
  form: FormInstance;
  edit: boolean;
  chapterId?: number;
}> = ({
  showChapterDrawer,
  updateChapter,
  createChapter,
  loading,
  open,
  courseId,
  edit,
  currentSeqIds,
  form,
  chapterId,
}) => {
  const router = useRouter();

  const onClose = () => {
    showChapterDrawer(false);
    form.resetFields();
  };

  return (
    <>
      <Drawer
        className={styles.newChapterDetails}
        title={edit ? "Update Chapter" : "New Chapter Details"}
        placement="right"
        maskClosable={false}
        onClose={() => {
          onClose();
        }}
        open={open}
        footer={
          <Form
            form={form}
            onFinish={() => {
              edit && chapterId ? updateChapter(chapterId) : createChapter(courseId);
            }}
          >
            <Space className={styles.footerBtn}>
              <Button onClick={() => {}} type="primary" htmlType="submit">
                {edit ? "Update" : "Save"}
              </Button>
              <Button
                type="default"
                onClick={() => {
                  onClose();
                  router.query.chapterId && router.replace(`/admin/content`);
                }}
              >
                Cancel
              </Button>
            </Space>
          </Form>
        }
      >
        <Form form={form} layout="vertical">
          <div className={styles.formCourseName}>
            <Form.Item label="Title" name="name" rules={[{ required: true, message: "Please Enter Title" }]}>
              <Input placeholder="Set the title of the chapter" />
            </Form.Item>
            <div>
              <div>
                <Form.Item
                  name="description"
                  label="Description"
                  rules={[{ required: true, message: "Please Enter Description" }]}
                >
                  <Input.TextArea rows={4} placeholder="Brief description about the chapter" />
                </Form.Item>
              </div>
            </div>
          </div>
        </Form>
      </Drawer>
    </>
  );
};

export default AddCourseChapter;
