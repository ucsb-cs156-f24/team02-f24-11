package edu.ucsb.cs156.example.web;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.annotation.DirtiesContext.ClassMode;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import static com.microsoft.playwright.assertions.PlaywrightAssertions.assertThat;
import java.time.LocalDateTime;
import edu.ucsb.cs156.example.WebTestCase;

@ExtendWith(SpringExtension.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.DEFINED_PORT)
@ActiveProfiles("integration")
@DirtiesContext(classMode = ClassMode.BEFORE_EACH_TEST_METHOD)
public class MenuItemReviewWebIT extends WebTestCase {
    @Test
    public void admin_user_can_create_edit_delete_review() throws Exception {
        setupUser(true);

        page.getByText("Menu Item Reviews").click();

        page.getByText("Create MenuItemReviews").click();
        assertThat(page.getByText("Create New MenuItemReviews")).isVisible();
        page.getByTestId("MenuItemReviewsForm-itemId").fill("3");
        page.getByTestId("MenuItemReviewsForm-reviewEmail").fill("email@ucsb.edu");
        page.getByTestId("MenuItemReviewsForm-stars").fill("1");
        page.getByTestId("MenuItemReviewsForm-dateReviewed").fill("2022-01-03T00:00");
        page.getByTestId("MenuItemReviewsForm-comments").fill("bad");
        page.getByTestId("MenuItemReviewsForm-submit").click();







        //assertThat(page.getByTestId("MenuItemReviewsTable-cell-row-0-col-itemId")).hasText("3");
        //assertThat(page.getByTestId("MenuItemReviewsTable-cell-row-0-col-reviewEmail")).hasText("email@ucsb.edu");
        //assertThat(page.getByTestId("MenuItemReviewsTable-cell-row-0-col-stars")).hasText("1");
        //assertThat(page.getByTestId("MenuItemReviewsTable-cell-row-0-col-dateReviewed")).hasText("2022-01-03T00:00");
        assertThat(page.getByTestId("MenuItemReviewsTable-cell-row-0-col-comments")).hasText("bad");





        page.getByTestId("MenuItemReviewsTable-cell-row-0-col-Edit-button").click();
        assertThat(page.getByText("Edit MenuItemReviews")).isVisible();


        page.getByTestId("MenuItemReviewsForm-itemId").fill("4");
        page.getByTestId("MenuItemReviewsForm-reviewEmail").fill("test@ucsb.edu");
        page.getByTestId("MenuItemReviewsForm-stars").fill("4");
        page.getByTestId("MenuItemReviewsForm-dateReviewed").fill("2022-01-03T00:10");
        page.getByTestId("MenuItemReviewsForm-comments").fill("better");



        page.getByTestId("MenuItemReviewsForm-submit").click();

        assertThat(page.getByTestId("MenuItemReviewsTable-cell-row-0-col-itemId")).hasText("4");
        assertThat(page.getByTestId("MenuItemReviewsTable-cell-row-0-col-reviewEmail")).hasText("test@ucsb.edu");
        assertThat(page.getByTestId("MenuItemReviewsTable-cell-row-0-col-stars")).hasText("4");
        assertThat(page.getByTestId("MenuItemReviewsTable-cell-row-0-col-dateReviewed")).hasText("2022-01-03T00:10");
        assertThat(page.getByTestId("MenuItemReviewsTable-cell-row-0-col-comments")).hasText("better");

        page.getByTestId("MenuItemReviewsTable-cell-row-0-col-Delete-button").click();

        assertThat(page.getByTestId("MenuItemReviewsTable-cell-row-0-col-itemId")).not().isVisible();
    }

    @Test
    public void regular_user_cannot_create_review() throws Exception {
        setupUser(false);

        page.getByText("Menu Item Reviews").click();

        assertThat(page.getByText("Create MenuItemReviews")).not().isVisible();
        assertThat(page.getByTestId("MenuItemReviewsTable-cell-row-0-col-itemId")).not().isVisible();
    }
}
