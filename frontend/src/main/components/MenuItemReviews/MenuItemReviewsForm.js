import { Button, Form, Row, Col } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
function MenuItemReviewsForm({
  initialContents,
  submitAction,
  buttonLabel = "Create",
}) {
  // Stryker disable all
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({ defaultValues: initialContents || {} });
  // Stryker restore all
  const navigate = useNavigate();
  // For explanation, see: https://stackoverflow.com/questions/3143070/javascript-regex-iso-datetime
  // Note that even this complex regex may still need some tweaks
  // Stryker disable Regex
  const isodate_regex =
    /(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+)|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d)|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d)/i;
  // Stryker restore Regex
  // Stryker disable next-line all
  // const yyyyq_regex = /((19)|(20))\d{2}[1-4]/i; // Accepts from 1900-2099 followed by 1-4.  Close enough.
  return (
    <Form onSubmit={handleSubmit(submitAction)}>
      <Row>
        {initialContents && (
          <Col>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="id">Id</Form.Label>
              <Form.Control
                data-testid="MenuItemReviewsForm-id"
                id="id"
                type="text"
                {...register("id")}
                value={initialContents.id}
                disabled
              />
            </Form.Group>
          </Col>
        )}
      </Row>

      <Row>
        <Col>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="itemId">Item ID</Form.Label>
            <Form.Control
              data-testid="MenuItemReviewsForm-itemId"
              id="itemId"
              type="text"
              isInvalid={Boolean(errors.itemId)}
              {...register("itemId", {
                required: "Item ID is required.",
              })}
            />
            <Form.Control.Feedback type="invalid">
              {errors.itemId?.message}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="reviewEmail">Reviewer Email</Form.Label>
            <Form.Control
              data-testid="MenuItemReviewsForm-reviewEmail"
              id="reviewEmail"
              type="email"
              isInvalid={Boolean(errors.reviewEmail)}
              {...register("reviewEmail", {
                required: "Reviewer Email is required.",
              })}
            />
            <Form.Control.Feedback type="invalid">
              {errors.reviewEmail?.message}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="stars">Stars</Form.Label>
            <Form.Control
              data-testid="MenuItemReviewsForm-stars"
              id="stars"
              type="text"
              isInvalid={Boolean(errors.stars)}
              {...register("stars", {
                required: "Stars is required.",
              })}
            />
            <Form.Control.Feedback type="invalid">
              {errors.stars?.message}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="dateReviewed">
              Date Reviewed (iso format)
            </Form.Label>
            <Form.Control
              data-testid="MenuItemReviewsForm-dateReviewed"
              id="dateReviewed"
              type="datetime-local"
              isInvalid={Boolean(errors.dateReviewed)}
              {...register("dateReviewed", {
                required: true,
                pattern: isodate_regex,
              })}
            />
            <Form.Control.Feedback type="invalid">
              {errors.dateReviewed && "Date Reviewed is required. "}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="comments">Comments</Form.Label>
            <Form.Control
              data-testid="MenuItemReviewsForm-comments"
              id="comments"
              type="text"
              isInvalid={Boolean(errors.comments)}
              {...register("comments", {
                required: "Comments is required.",
              })}
            />
            <Form.Control.Feedback type="invalid">
              {errors.comments?.message}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col>
          <Button type="submit" data-testid="MenuItemReviewsForm-submit">
            {buttonLabel}
          </Button>
          <Button
            variant="Secondary"
            onClick={() => navigate(-1)}
            data-testid="MenuItemReviewsForm-cancel"
          >
            Cancel
          </Button>
        </Col>
      </Row>
    </Form>
  );
}
export default MenuItemReviewsForm;
