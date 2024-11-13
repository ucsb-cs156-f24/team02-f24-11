package edu.ucsb.cs156.example.web;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.annotation.DirtiesContext.ClassMode;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import static com.microsoft.playwright.assertions.PlaywrightAssertions.assertThat;

import edu.ucsb.cs156.example.WebTestCase;

@ExtendWith(SpringExtension.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.DEFINED_PORT)
@ActiveProfiles("integration")
@DirtiesContext(classMode = ClassMode.BEFORE_EACH_TEST_METHOD)
public class ArticleWebIT extends WebTestCase {
    @Test
    public void admin_user_can_create_edit_delete_article() throws Exception {
        setupUser(true);

        page.getByText("Article").click();

        page.getByText("Create New Articles").click();
        assertThat(page.getByText("Create New Articles")).isVisible();
        page.getByTestId("ArticleForm-title").fill("New article");
        page.getByTestId("ArticleForm-url").fill("New url");
        page.getByTestId("ArticleForm-explanation").fill("New explanation");
        page.getByTestId("ArticleForm-email").fill("New email");
        page.getByTestId("ArticleForm-dateAdded").fill("2022-01-03T00:00:00");
        page.getByTestId("ArticleForm-submit").click();

        assertThat(page.getByTestId("ArticleTable-cell-row-0-col-url"))
                .hasText("New url");

        page.getByTestId("ArticleTable-cell-row-0-col-Edit-button").click();
        assertThat(page.getByText("Edit Article")).isVisible();
        page.getByTestId("ArticleForm-explanation").fill("good article");
        page.getByTestId("ArticleForm-submit").click();

        assertThat(page.getByTestId("ArticleTable-cell-row-0-col-explanation")).hasText("good article");

        page.getByTestId("ArticleTable-cell-row-0-col-Delete-button").click();

        assertThat(page.getByTestId("ArticleTable-cell-row-0-col-title")).not().isVisible();
    }

    @Test
    public void regular_user_cannot_create_article() throws Exception {
        setupUser(false);

        page.getByText("Articles").click();

        assertThat(page.getByText("Create New Articles")).not().isVisible();
        assertThat(page.getByTestId("ArticleTable-cell-row-0-col-title")).not().isVisible();
    }
}