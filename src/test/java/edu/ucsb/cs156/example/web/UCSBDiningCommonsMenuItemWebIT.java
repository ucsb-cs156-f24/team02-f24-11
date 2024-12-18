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
public class UCSBDiningCommonsMenuItemWebIT extends WebTestCase {

    @Test
    public void admin_user_can_create_edit_delete_menu_item() throws Exception {
        setupUser(true);

        page.getByText("UCSB Dining Commons Menu Items").click();

        page.getByText("Create UCSBDiningCommonsMenuItem").click();
        assertThat(page.getByText("Create New UCSBDiningCommonsMenuItem")).isVisible();
        page.getByTestId("UCSBDiningCommonsMenuItemForm-diningCommonsCode").fill("Carrillo");
        page.getByTestId("UCSBDiningCommonsMenuItemForm-name").fill("Baked Beans");
        page.getByTestId("UCSBDiningCommonsMenuItemForm-station").fill("Salad Bar");
        page.getByTestId("UCSBDiningCommonsMenuItemForm-submit").click();

        assertThat(page.getByTestId("UCSBDiningCommonsMenuItemsTable-cell-row-0-col-name"))
            .hasText("Baked Beans");
        
        page.getByTestId("UCSBDiningCommonsMenuItemsTable-cell-row-0-col-Edit-button").click();
        assertThat(page.getByText("Edit UCSBDiningCommonsMenuItem")).isVisible();
        page.getByTestId("UCSBDiningCommonsMenuItemForm-station").fill("Entrees");
        page.getByTestId("UCSBDiningCommonsMenuItemForm-submit").click();

        assertThat(page.getByTestId("UCSBDiningCommonsMenuItemsTable-cell-row-0-col-station")).hasText("Entrees");

        page.getByTestId("UCSBDiningCommonsMenuItemsTable-cell-row-0-col-Delete-button").click();

        assertThat(page.getByTestId("UCSBDiningCommonsMenuItemsTable-cell-row-0-col-name")).not().isVisible();
    }

    @Test
    public void regular_user_cannot_create_menu_item() throws Exception {
        setupUser(false);

        page.getByText("UCSB Dining Commons Menu Items").click();
        assertThat(page.getByText("Create UCSBDiningCommonsMenuItem")).not().isVisible();
        assertThat(page.getByTestId("UCSBDiningCommonsMenuItemsTable-cell-row-0-col-name")).not().isVisible();
    }
}
